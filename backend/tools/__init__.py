# Agent tool definitions — exported for Claude tool_use
from backend.tools.fetch_file import TOOL_DEFINITION as FETCH_FILE_TOOL
from backend.tools.fetch_file import fetch_file_content
from backend.tools.search_code import TOOL_DEFINITION as SEARCH_CODE_TOOL
from backend.tools.search_code import search_codebase
from backend.tools.fetch_tests import TOOL_DEFINITION as FETCH_TESTS_TOOL
from backend.tools.fetch_tests import fetch_test_file

TOOL_DEFINITIONS = [FETCH_FILE_TOOL, SEARCH_CODE_TOOL, FETCH_TESTS_TOOL]