#!/usr/bin/env python3

from heapq import heappop, heappush
from sys import argv, exit

INITIAL_FLOOR = 1

class Person:
    def __init__(self, id, time, src, dst):
        self.id = id
        self.arrive_time = time
        self.src = src
        self.dst = dst

    def direction(self):
        return -1 if self.src > self.dst else 1

    def __lt__(self, other):
        return self.arrive_time < other.arrive_time # for sorting by increasing arrival time

class Elevator:
    def __init__(self):
        self.floor = INITIAL_FLOOR
        self.passenger = None
        self.direction = 0 # down is -1, up is 1, and idle is 0

    # This is the 'car call', a floor request, made from inside the elevator
    def target(self):
        return self.passenger.dst if self.passenger else None

    def can_dropoff(self):
        return self.passenger and self.floor == self.target()

class Simulator:
    def __init__(self):
        self.time = 0
        self.arrivals = [] # time-ordered queue of people on their way to a lobby
        self.up_calls = [] # min-heap of tuple(floor, person)
        self.down_calls = [] # min-heap of tuple(-floor, person), with -floors to mimic a max-heap
        self.elevator = Elevator()

    def add_person(self, person):
        heappush(self.arrivals, person)

    def handle_arrivals(self):
        while len(self.arrivals) and self.arrivals[0].arrive_time <= self.time:
            p = heappop(self.arrivals)
            # this person makes a direction call if they are not already at their destination
            if p.src != p.dst:
                if p.direction() == 1:
                    heappush(self.up_calls, (p.src, p))
                else:
                    heappush(self.down_calls, (-p.src, p))
            print(f"t={self.time}: P{p.id} arrived at F{p.src} -> F{p.dst}")

    def unload_elevator(self):
        if self.elevator.can_dropoff():
            p = self.elevator.passenger
            print(f"t={self.time}: P{p.id} dropped off at F{self.elevator.floor}")
            self.elevator.passenger = None
            self.elevator.direction = 0

    '''
        if the elevator arrives empty at a floor that has someone waiting,
        pick them up and take them to their destination, giving priority to up-calls
    '''
    def load_elevator(self):
        if self.elevator.passenger:
            return
        f = self.elevator.floor
        if self.up_calls and self.up_calls[0][0] == f:
            _, p = heappop(self.up_calls)
            self.elevator.passenger = p
            self.elevator.direction = p.direction()
            print(f"t={self.time}: P{p.id} boarded at F{f}, going to F{p.dst}")
        elif self.down_calls and abs(self.down_calls[0][0]) == f:
            _, p = heappop(self.down_calls)
            self.elevator.passenger = p
            self.elevator.direction = p.direction()
            print(f"t={self.time}: P{p.id} boarded at F{f}, going to F{p.dst}")

    def move_elevator(self):
        if not self.elevator.passenger:
            # move toward the nearest call, first picking from up-calls first
            if self.up_calls:
                f, _ = self.up_calls[0]
                self.elevator.direction = 1 if f > self.elevator.floor else -1
            elif self.down_calls:
                f, _ = self.down_calls[0]
                f = abs(f)
                self.elevator.direction = 1 if f > self.elevator.floor else -1
            else:
                self.elevator.direction = 0
                return

        # move 1 floor in the current direction
        self.elevator.floor += self.elevator.direction
        print(f"t={self.time}: elevator moved to F{self.elevator.floor}")

    def run(self):
        while self.arrivals or self.up_calls or self.down_calls or self.elevator.passenger:
            self.handle_arrivals()
            self.unload_elevator()
            self.load_elevator()
            self.move_elevator()
            self.time += 1


def main():
    usage = '''Usage: main.py [OPTION] <P0_TIME> <P0_SRC> <P0_DST> [<P1_TIME> <P1_SRC> <P1_DST> ...]

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
'''
    arg_len = len(argv)
    if arg_len < 2:
        print('Error: No input.')
        return 1
    elif (argv[1] == '-h'):
        print(usage)
    elif (arg_len - 1) % 3 == 0:
        p_cnt = 0
        sim = Simulator()
        for i in range(1, arg_len, 3):
            try:
                time = max(0, int(argv[i]))
                src = max(1, int(argv[i + 1]))
                dst = max(1, int(argv[i + 2]))
                sim.add_person(Person(p_cnt, time, src, dst))
                p_cnt += 1
            except:
                print('Error: Invalid person argument(s).')
                return 1
        print('\nBegin simulation.')
        sim.run()
        print('Simulation complete.')
    else:
        print('Error: Invalid input.')
        return 1

    return 0

if __name__ == "__main__":
    exit(main())
