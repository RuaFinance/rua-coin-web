#!/bin/bash
# Copyright 2025 chenjjiaa
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# This script uses pre-commit hooks to add license headers
# The hook file is located at .git/hooks/pre-commit
# The hook file uses scripts/add_license_header.py to add license headers

pre-commit run --all-files
