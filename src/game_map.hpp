#pragma once

#include <memory.h>

#include "structs.hpp"

class GameMap {
public:
  const int width;
  const int height;
  std::vector<std::vector<int>> extra_cost;
  std::vector<std::vector<bool>> walkable;

  GameMap(int width, int height)
    : width(width), height(height) {
    extra_cost.resize(height);
    walkable.resize(height);
    for (int i = 0; i < height; ++i) {
      extra_cost[i].resize(width);
      walkable[i].resize(width);
    }

    for (int y = 0; y < height; ++y) {
      for (int x = 0; x < width; ++x) {
        walkable[y][x] = true;
      }
    }
  }
  ~GameMap() {}

  void set_extra_cost(Point pos, int value) {
    extra_cost[pos.y][pos.x] = value;
  }
  void set_walkable(Point pos, bool value) {
    walkable[pos.y][pos.x] = value;
  }

  int get_extra_cost(Point pos) { return extra_cost[pos.y][pos.x]; }
  bool get_walkable(Point pos) { return walkable[pos.y][pos.x]; }

  void draw();
};
