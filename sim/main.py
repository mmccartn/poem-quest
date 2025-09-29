#!/usr/bin/env python3

from heapq import heappop, heappush

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
    p_cnt = 0
    sim = Simulator()

    help = '''Elevator Simulator:

Description:
  This simulates a single one-person elevator using the SCAN algorithm.

Options:
  q                         Quit the setup loop.
  h                         Show this text.
  r                         Run the simulation
  p <TIME> <SRC> <DST>      Schedule a person to arrive at TIME, on floor SRC,
                            that will call the elevator and ride to floor DST.\n'''
    print(help)
    while True:
        user_in = input().lower()
        if not user_in:
            print('Error: no input.\n')
            continue

        flag = user_in[0]
        if flag == 'q':
            break
        elif flag == 'h':
            print(help)
        elif flag == 'r':
            print('\nBegin simulation.')
            sim.run()
            print('Simulation complete.\n')
            break
        elif flag == 'p':
            try:
                args = user_in[2:].split()
                time = max(0, int(args[0]))
                src = max(1, int(args[1]))
                dst = max(1, int(args[2]))
                sim.add_person(Person(p_cnt, time, src, dst))
                print(f'Scheduled P{p_cnt}, to arrive at t={time}, on F{src} -> F{dst}.\n')
                p_cnt += 1
            except:
                print('Error: Invalid person argument(s).\n')
        else:
            print('Error: Invalid option.\n')

    print('Exiting.')


if __name__ == "__main__":
    main()
