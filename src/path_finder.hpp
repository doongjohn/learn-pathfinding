#pragma once

#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>

#include "structs.hpp"
#include "game_map.hpp"

class PathFinder {
private:
  GameMap &game_map;

public:
  ~PathFinder() {}
  PathFinder(GameMap &map) : game_map(map) {}

  bool is_in_bounds(Point pos);
  Neighbors get_neighbors(Point pos);

  std::vector<Point> dijkstra(Point start, Point dest);

  void draw_path(std::vector<Point> path);
};

inline bool PathFinder::is_in_bounds(Point pos) {
  return
    pos.x >= 0 &&
    pos.y >= 0 &&
    pos.x < game_map.width &&
    pos.y < game_map.height;
}

inline Neighbors PathFinder::get_neighbors(Point pos) {
  Neighbors result;

  constexpr const int straight_path_cost = 10;
  constexpr const int diagonal_path_cost = 14;

  result.nodes[0] = Node(pos.x + 1, pos.y);
  result.nodes[1] = Node(pos.x - 1, pos.y);
  result.nodes[2] = Node(pos.x, pos.y + 1);
  result.nodes[3] = Node(pos.x, pos.y - 1);
  for (int i = 0; i <= 3; ++i) {
    result.weights[i] = straight_path_cost;
  }

  result.nodes[4] = Node(-1, -1);
  result.nodes[5] = Node(-1, -1);
  result.nodes[6] = Node(-1, -1);
  result.nodes[7] = Node(-1, -1);

  if ((is_in_bounds(result.nodes[0].pos) && game_map.get_walkable(result.nodes[0].pos)) ||
      (is_in_bounds(result.nodes[2].pos) && game_map.get_walkable(result.nodes[2].pos))) {
    result.nodes[4] = Node(pos.x + 1, pos.y + 1);
  }
  if ((is_in_bounds(result.nodes[0].pos) && game_map.get_walkable(result.nodes[0].pos)) ||
      (is_in_bounds(result.nodes[3].pos) && game_map.get_walkable(result.nodes[3].pos))) {
    result.nodes[5] = Node(pos.x + 1, pos.y - 1);
  }
  if ((is_in_bounds(result.nodes[1].pos) && game_map.get_walkable(result.nodes[1].pos)) ||
      (is_in_bounds(result.nodes[2].pos) && game_map.get_walkable(result.nodes[2].pos))) {
    result.nodes[6] = Node(pos.x - 1, pos.y + 1);
  }
  if ((is_in_bounds(result.nodes[1].pos) && game_map.get_walkable(result.nodes[1].pos)) ||
      (is_in_bounds(result.nodes[3].pos) && game_map.get_walkable(result.nodes[3].pos))) {
    result.nodes[7] = Node(pos.x - 1, pos.y - 1);
  }

  for (int i = 4; i <= 7; ++i) {
    result.weights[i] = diagonal_path_cost;
  }

  return result;
}

inline std::vector<Point> PathFinder::dijkstra(Point start, Point dest) {
  // check out of bounds
  if (!is_in_bounds(start) || !is_in_bounds(dest)) {
    return {};
  }

  std::vector<Point> path;
  std::unordered_map<Point, Node> node_lookup; // store explored node data
  Array2D<bool> visited(game_map.width, game_map.height);
  visited.set_all(false);

  std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pq;
  pq.push(Node(start.x, start.y));

  while (!pq.empty()) {
    // get next node
    Node current_node = pq.top();
    pq.pop();

    // update visited
    visited.at(current_node.pos) = true;

    // update node_lookup
    node_lookup[current_node.pos] = current_node;

    // destination found
    if (current_node.pos == dest) {
      // backtrace parent to find a path
      Node parent = current_node;
      while (true) {
        path.push_back(parent.pos);
        parent = node_lookup[parent.parent_pos];
        if (parent.pos == start) {
          path.push_back(parent.pos); // add starting position
          break;
        }
      }
      std::reverse(path.begin(), path.end());
      return path;
    }

    // update neighbors
    auto neighbors = get_neighbors(current_node.pos);
    for (int i = 0; i < neighbors.nodes.size(); ++i) {
      #define neighbor neighbors.nodes[i]
      #define weight neighbors.weights[i]

      // check array bounds
      if (!is_in_bounds(neighbor.pos)) {
        continue;
      }

      // check walkable
      if (!game_map.get_walkable(neighbor.pos)) {
        continue;
      }

      // skip visited
      if (visited.at(neighbor.pos)) {
        continue;
      }

      // Understanding Edge Relaxation for Dijkstra’s Algorithm and Bellman-Ford Algorithm:
      // https://towardsdatascience.com/algorithm-shortest-paths-1d8fa3f50769
      const bool node_first_time = node_lookup.find(neighbor.pos) == node_lookup.end();
      const int new_cost = current_node.cost + weight + game_map.get_extra_cost(neighbor.pos);
      if (node_first_time || node_lookup[neighbor.pos].cost > new_cost) {
        // update cost and parent (edge relaxation)
        neighbor.cost = new_cost;
        neighbor.parent_pos = current_node.pos;
        node_lookup[neighbor.pos] = neighbor;
      }

      // push to priority queue
      pq.push(neighbor);
    }
    #undef neighbor
    #undef weight
  }

  return {};
}

inline void PathFinder::draw_path(std::vector<Point> path) {
  for (int y = 0; y < game_map.height; ++y) {
    for (int x = 0; x < game_map.width; ++x) {
      if (std::find(path.begin(), path.end(), Point(x, y)) != path.end()) {
        fputs("* ", stdout);
      } else {
        fputs(". ", stdout);
      }
    }
    puts("");
  }
}
