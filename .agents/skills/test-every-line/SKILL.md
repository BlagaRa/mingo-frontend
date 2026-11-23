---
name: test-every-line
description: >-
  Requires an automated test that executes every new or changed line of
  production code. Use on every implementation, bugfix, refactor, or when the
  user mentions tests, coverage, or "test pentru fiecare linie".
---

# Test pentru fiecare linie

Trebuie un test pentru fiecare linie de cod adăugată.

## Rule

Every line of production code you add or change must be executed by an automated test in the same change. A line with no test does not land.

## What counts

- Production code means application logic, UI behavior, handlers, queries, and validation.
- The test must run that line. Importing the file is not enough.
- Test files, type-only declarations, and comments do not need their own tests.
- Do not add config or generated files unless an existing check fails without them.

## How

1. Use the test runner already in the project. Do not add a new framework.
2. Write the test in the same change as the code. One test may cover many lines when it actually executes each of them.
3. Run the tests before finishing. The change is unfinished if a new line is not hit or a test fails.
4. If a line cannot be executed by a test, delete it or reshape it until it can.

## With ponytail

Keep production code minimal. Tests are part of the change. This skill overrides ponytail where ponytail would skip a test for a trivial change: every added production line still needs a test.
