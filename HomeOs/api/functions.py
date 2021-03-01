from string import ascii_letters
import random

characters = list(ascii_letters)


def random_string(length=20):
    return "".join([random.choice(characters) for _ in range(length)])
