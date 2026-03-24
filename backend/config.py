"""Config management — ~/.cr/config.toml"""

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


def load_config() -> dict:
    """Load config from ~/.cr/config.toml, falling back to env vars and defaults."""
    cfg = dict(DEFAULTS)

    # Layer 1: config file
    if CONFIG_PATH.exists():
        if sys.version_info >= (3, 12):
            import tomllib
        else:
            import tomli as tomllib
        with open(CONFIG_PATH, "rb") as f:
            file_cfg = tomllib.load(f)
        cfg.update(file_cfg)

    # Layer 2: env vars override file
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
