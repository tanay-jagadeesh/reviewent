"""Config management — layered: defaults → ~/.cr/config.toml → .cr.toml → env vars"""

import os
import sys
from pathlib import Path

CONFIG_DIR = Path.home() / ".cr"
CONFIG_PATH = CONFIG_DIR / "config.toml"

DEFAULTS = {
    "model": "gpt-4o",
    "openai_api_key": "",
    "anthropic_api_key": "",
    "github_token": "",
    "custom_rules": "",
    "severity_filter": "critical,warning,suggestion,nitpick",
}


def _load_toml(path: Path) -> dict:
    """Load a TOML file, returning {} if it doesn't exist."""
    if not path.exists():
        return {}
    if sys.version_info >= (3, 12):
        import tomllib
    else:
        import tomli as tomllib
    with open(path, "rb") as f:
        return tomllib.load(f)


def load_project_config() -> dict:
    """Load .cr.toml from the current directory (or parents up to root)."""
    cwd = Path.cwd()
    for d in [cwd, *cwd.parents]:
        cr_toml = d / ".cr.toml"
        if cr_toml.exists():
            return _load_toml(cr_toml)
    return {}


def load_config() -> dict:
    """Load config with layered precedence: defaults → user → project → env."""
    cfg = dict(DEFAULTS)

    # Layer 1: user config (~/.cr/config.toml)
    user_cfg = _load_toml(CONFIG_PATH)
    cfg.update(user_cfg)

    # Layer 2: project config (.cr.toml) — review/ignore sections are flattened
    proj = load_project_config()
    review_cfg = proj.get("review", {})
    if review_cfg.get("model"):
        cfg["model"] = review_cfg["model"]
    if review_cfg.get("rules"):
        cfg["custom_rules"] = review_cfg["rules"]
    if review_cfg.get("language"):
        cfg["language"] = review_cfg["language"]
    if review_cfg.get("fail_on"):
        cfg["fail_on"] = review_cfg["fail_on"]
    if proj.get("ignore", {}).get("paths"):
        cfg["ignore_paths"] = proj["ignore"]["paths"]

    # Layer 3: env vars override everything
    env_map = {
        "OPENAI_API_KEY": "openai_api_key",
        "ANTHROPIC_API_KEY": "anthropic_api_key",
        "GITHUB_TOKEN": "github_token",
        "CR_MODEL": "model",
    }
    for env_key, cfg_key in env_map.items():
        val = os.getenv(env_key)
        if val:
            cfg[cfg_key] = val

    return cfg


def save_config(cfg: dict) -> None:
    """Write config to ~/.cr/config.toml."""
    import tomli_w

    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_PATH, "wb") as f:
        tomli_w.dump(cfg, f)
