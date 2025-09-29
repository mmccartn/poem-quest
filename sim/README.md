Elevator Simulator
==================
This simulates a single one-person elevator using the SCAN algorithm.

Assumptions
-----------
- The elevator has a capacity of 1.
- Capacity is the number of people, not weight.
- The elevator starts at floor 1.
- There is no limit to the height of the building.
- People may arrive at any positive integer time unit.
- People do not make any mistakes when selecting their floor and call direction.
- An idle elevator moves toward up-call requests first.
- When loading, pick up the waiting person regardless of call direction.
- When loading, up-calls are given priority.
- The elevator moves at 1 time unit per floor and has infinite acceleration.
- Passengers do not take any time to load or unload.
- Negative arrival times are adjusted to 0.
- Negative floors are adjusted to 1.
- People that arrive already on their destination floor do not enter the elevator.
- Incremental person ids are automatically assigned, starting at P0.

Features Not Implemented
------------------------
- An idle elevator moves toward the closest (or farthest?) call first.
- A carrying capacity greater than 1.
- Capacity measured in weight.
- Only pick up people along the way that are going in the selected call direction.
- Prioritize in-elevator 'car calls' over normal floor/landing calls.
- Weight for each person.
- Time to start moving, to load, and unload.
- Model elevator lobbies as a group of chaotic people instead of two orderly lines.
- Allow people to make mistakes and get on the elevator going in the wrong direction.
- In-car buttons for door-close, door-open, and emergency.
- Elevator maintenance time.

Requirements
------------
- Python 3.6+

Usage
-----
Run `python main.py -h` for the following usage instructions:

```
Usage: main.py [OPTION] <P0_TIME> <P0_SRC> <P0_DST> [<P1_TIME> <P1_SRC> <P1_DST> ...]

Simulate an elevator system given a list of passengers.

Each passenger is described by three numbers:
  TIME:     The arrival time of the passenger (integer, in sim time units).
  SRC:      The source floor where the passenger starts.
  DST:      The destination floor where the passenger wants to go.

Arguments must be provided in groups of three, one group per passenger.

Option:
  -h        Show this help message and exit.

Examples:
  # One passenger, arriving at t=0, starting at floor 1, going to floor 5
  main.py 0 1 5

  # Two passengers:
  #   P0 arrives at t=0, at floor 1, going to 5
  #   P1 arrives at t=3, at floor 2, going to 7
  main.py 0 1 5 3 2 7
```

Example
-------
```
$ python main.py 0 5 6 0 5 4 0 9 10

Begin simulation.
t=0: P0 arrived at F5 -> F6
t=0: P1 arrived at F5 -> F4
t=0: P2 arrived at F9 -> F10
t=0: elevator moved to F2
t=1: elevator moved to F3
t=2: elevator moved to F4
t=3: elevator moved to F5
t=4: P0 boarded at F5, going to F6
t=4: elevator moved to F6
t=5: P0 dropped off at F6
t=5: elevator moved to F7
t=6: elevator moved to F8
t=7: elevator moved to F9
t=8: P2 boarded at F9, going to F10
t=8: elevator moved to F10
t=9: P2 dropped off at F10
t=9: elevator moved to F9
t=10: elevator moved to F8
t=11: elevator moved to F7
t=12: elevator moved to F6
t=13: elevator moved to F5
t=14: P1 boarded at F5, going to F4
t=14: elevator moved to F4
t=15: P1 dropped off at F4
Simulation complete.
```
