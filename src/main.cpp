#include "game_map.hpp"
#include "path_finder.hpp"

#include "httplib.h"
#include "json.hpp"

using nlohmann::json;

struct GameData {
  GameMap game_map;
  PathFinder path_finder;
  Point startingPoint;
  Point destinationPoint;
  json json_map_data;

  GameData(const int width, const int height)
    : game_map(width, height),
      path_finder(game_map) {
    startingPoint = Point(0, 0);
    destinationPoint = Point(width - 1, height - 1);
    json_map_data["gridWidth"] = game_map.width; // this is a constant data
    json_map_data["gridHeight"] = game_map.height; // this is a constant data
    update_all_json();
  }

  void update_all_json() {
    json_map_data["startingPoint"] = startingPoint;
    json_map_data["destinationPoint"] = destinationPoint;
    json_map_data["extraCost"] = game_map.extra_cost;
    json_map_data["walkable"] = game_map.walkable;
  }
  void update_all_data() {
    startingPoint = json_map_data["startingPoint"];
    destinationPoint = json_map_data["destinationPoint"];
    game_map.extra_cost = json_map_data["extraCost"];
    game_map.walkable = json_map_data["walkable"];
  }
};

void start_server(GameData &data) {
  using namespace httplib;

  Server svr;
  if (!svr.set_mount_point("/", "./frontend")) {
    std::cout << "error: The specified base directory doesn't exist...\n";
    exit(1);
  }

  svr.Get("/get_map_json", [&](const Request &req, Response &res) {
    res.set_content(data.json_map_data.dump(), "application/json");
  });

  svr.Get("/get_path_json", [&](const Request &req, Response &res) {
    json json_dijkstra_result = data.path_finder.dijkstra(data.startingPoint, data.destinationPoint);
    res.set_content(json_dijkstra_result.dump(), "application/json");
  });

  svr.Post("/set_map_json", [&](const Request &req, Response &res) {
    data.json_map_data = json::parse(req.body);
    data.update_all_data();
  });

  std::cout << "starting local http server -> http://localhost:3000\n";
  svr.listen("localhost", 3000);
}

int main() {
  GameData data(20, 20);
  start_server(data);
  return 0;
}
