# Task: Implement CLI Tool

## User Story Reference
All user stories - provides the interface for users to interact with the DSL and visualization

## Description
Implement the command-line interface that ties together the parser and visualizer. Users can run commands to validate their north star DSL files and generate visualizations.

## Files to Modify/Create
- `src/index.js` - Complete CLI implementation
- `src/utils/logger.js` - Logging utilities
- `bin/northstar` - Executable wrapper script
- `tests/cli.test.js` - CLI integration tests

## Estimated Lines of Code
~75 lines (index: ~40, logger: ~15, bin: ~5, tests: ~15)

## Dependencies
- Task 002 (project structure)
- Task 003 (parser)
- Task 004 (visualizer)

## Implementation Notes
- Use `commander` for CLI framework
- Commands to implement:
  ```bash
  northstar visualize <input.yaml> [output.html]
    # Parse DSL and generate visualization

  northstar validate <input.yaml>
    # Validate DSL without generating output

  northstar --version
    # Show version

  northstar --help
    # Show help
  ```
- Use `chalk` for colored output:
  - Green for success messages
  - Red for errors
  - Yellow for warnings
- Logging utility for consistent output
- Handle errors gracefully with helpful messages
- Default output path: `northstar-visualization.html`
- Exit codes: 0 for success, 1 for errors
- Make bin/northstar executable with shebang

## Acceptance Criteria
- [ ] CLI commands work as specified
- [ ] `visualize` command generates visualization
- [ ] `validate` command checks DSL validity
- [ ] Help and version commands work
- [ ] Colored output for errors and success
- [ ] Clear error messages guide users
- [ ] Integration tests verify command execution
- [ ] Tests pass
