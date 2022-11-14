#pragma once

#include <array>
#include <functional>
#include <memory>
#include <string>

#include "json.hpp"

// source: https://stackoverflow.com/a/26221725
template <typename... Args>
auto string_format(const std::string &format, Args... args) -> std::string {
  int size_s = std::snprintf(nullptr, 0, format.c_str(), args...) + 1; // Extra space for '\0'
  if (size_s <= 0) {
    throw std::runtime_error("Error during formatting.");
  }
  auto size = static_cast<size_t>(size_s);
  std::unique_ptr<char[]> buf(new char[size]);
  std::snprintf(buf.get(), size, format.c_str(), args...);
  return std::string(buf.get(), buf.get() + size - 1); // We don't want the '\0' inside
}

struct Point {
  int x;
  int y;

  Point() {
    this->x = 0;
    this->y = 0;
  }
  Point(int x, int y) {
    this->x = x;
    this->y = y;
  }
  Point(const Point &other) {
    this->x = other.x;
    this->y = other.y;
  }

  friend auto operator==(const Point &a, const Point &b) -> bool {
    return a.x == b.x && a.y == b.y;
  }
  friend auto operator!=(const Point &a, const Point &b) -> bool {
    return a.x != b.x || a.y != b.y;
  }
};

template <>
struct std::hash<Point> {
  auto operator()(const Point &value) const -> size_t {
    return hash<std::string>()(string_format("%d,%d", value.x, value.y));
  }
};

static auto to_json(nlohmann::json &j, const Point &value) -> void {
  j = nlohmann::json{{"x", value.x}, {"y", value.y}};
}
static auto from_json(const nlohmann::json &j, Point &value) -> void {
  j.at("x").get_to(value.x);
  j.at("y").get_to(value.y);
}

template <typename T>
struct Array2D {
  const int width;
  const int height;
  T **data;

  Array2D(int width, int height) : width(width), height(height) {
    data = new T *[height];
    for (int h = 0; h < height; ++h) {
      data[h] = new T[width];
    }
  }
  ~Array2D() {
    for (int h = 0; h < height; ++h) {
      delete[] data[h];
    }
    delete[] data;
  }

  auto at(int x, int y) -> T & {
    return data[y][x];
  }
  auto at(Point pos) -> T & {
    return data[pos.y][pos.x];
  }
  auto at_ptr(Point pos) -> T * {
    return &data[pos.y][pos.x];
  }

  auto for_each(std::function<void(int x, int y)> fn) -> void {
    for (int y = 0; y < height; ++y) {
      for (int x = 0; x < width; ++x) {
        fn(x, y);
      }
    }
  }

  auto set_all(T value) -> void {
    for (int h = 0; h < height; ++h) {
      for (int w = 0; w < width; ++w) {
        data[h][w] = value;
      }
    }
  }
};

struct Node {
  Point pos;
  Point parent_pos;
  int32_t cost;

  Node() : pos(-1, -1), parent_pos(-1, -1), cost(INT32_MAX) {}
  Node(int x, int y) : pos(x, y), parent_pos(-1, -1), cost(INT32_MAX) {}
  Node(const Node &other) : pos(other.pos), parent_pos(other.parent_pos), cost(other.cost) {}

  friend auto operator>(const Node &a, const Node &b) -> bool {
    return a.cost > b.cost;
  }
  friend auto operator<(const Node &a, const Node &b) -> bool {
    return a.cost < b.cost;
  }
  friend auto operator>=(const Node &a, const Node &b) -> bool {
    return a.cost >= b.cost;
  }
  friend auto operator<=(const Node &a, const Node &b) -> bool {
    return a.cost <= b.cost;
  }
};

struct NodeRef {
  Node *ptr;

  NodeRef(Node *ptr) : ptr(ptr) {}

  inline Node &get() const {
    return *ptr;
  }

  friend auto operator>(const NodeRef &a, const NodeRef &b) -> bool {
    return a.get().cost > b.get().cost;
  }
  friend auto operator<(const NodeRef &a, const NodeRef &b) -> bool {
    return a.get().cost < b.get().cost;
  }
  friend auto operator>=(const NodeRef &a, const NodeRef &b) -> bool {
    return a.get().cost >= b.get().cost;
  }
  friend auto operator<=(const NodeRef &a, const NodeRef &b) -> bool {
    return a.get().cost <= b.get().cost;
  }
};
