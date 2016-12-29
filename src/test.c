
char *test() {
  return "Hello World";
}

float mathAverage(int *array, int size) {
  int sum = 0;

  for (int i = 0; i < size; i++) {
    sum += array[i];
  }

  return sum / (float)size;
}
