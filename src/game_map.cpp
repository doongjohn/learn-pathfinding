#include <iostream>

#include "game_map.hpp"

void GameMap::draw() {
  std::cout << "=====================" << std::endl;
  for (int y = 0; y < height; ++y) {
    for (int x = 0; x < width; ++x) {
      if (get_walkable({x, y})) {
        std::cout << get_extra_cost({x, y});
      } else {
        std::cout << '#'; // wall
      }
      std::cout << "\t";
    }
    std::cout << '\n';
  }
}
