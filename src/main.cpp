#include <iostream>

#include "game_map.hpp"
#include "path_finder.hpp"

#include "httplib.h"
#include "json.hpp"

using nlohmann::json;

int main() {
  GameMap game_map(10, 10);
  PathFinder path_finder(game_map);

  Point startingPoint(0, 0);
  Point destinationPoint(9, 9);

  json json_map_data;
  json_map_data["startingPoint"] = startingPoint;
  json_map_data["destinationPoint"] = destinationPoint;
  json_map_data["extra_cost"] = game_map.extra_cost;
  json_map_data["walkable"] = game_map.walkable;

  httplib::Server svr;
  auto ret = svr.set_mount_point("/", "./frontend");
  if (!ret) {
    std::cout << "error: The specified base directory doesn't exist...\n";
    return 1;
  }

  svr.Get("/get_map_json", [&](const httplib::Request &req, httplib::Response &res) {
    res.set_content(json_map_data.dump(), "application/json");
  });

  svr.Post("/set_map_json", [&](const httplib::Request &req, httplib::Response &res) {
    json_map_data = json::parse(req.body);
    startingPoint = json_map_data["startingPoint"];
    destinationPoint = json_map_data["destinationPoint"];
    game_map.extra_cost = json_map_data["extra_cost"];
    game_map.walkable = json_map_data["walkable"];
  });

  svr.Get("/get_path_json", [&](const httplib::Request &req, httplib::Response &res) {
    json json_path_data = path_finder.dijkstra(startingPoint, destinationPoint);
    res.set_content(json_path_data.dump(), "application/json");
  });

  std::cout << "starting local http server -> http://localhost:3000\n";
  svr.listen("localhost", 3000);

  return 0;
}
