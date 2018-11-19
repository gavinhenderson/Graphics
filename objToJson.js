#!/usr/bin/env node

const fs = require("fs");
const pathToObj = process.argv[2];
const output = process.argv[3];

const inputText = fs.readFileSync(pathToObj, { encoding: "utf8" });
const jsonObj = convert(inputText);
fs.writeFileSync(output, JSON.stringify(jsonObj), { encoding: "utf8" });

function parseFloatN(s) {
  var v = parseFloat(s);
  if (isNaN(v)) v = 0;
  return v;
}

function parseIntN(s) {
  var v = parseInt(s);
  if (isNaN(v)) v = 0;
  return v;
}

function convert(obj) {
  String.prototype.fulltrim = function() {
    return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(
      /\s+/g,
      " ",
    );
  };
  var json = {
    vertexPositions: [],
    normals: [],
    texcoords: [],
    indices: [],
  };
  var v = [],
    vt = [],
    vn = [],
    f = [];
  var lines = obj.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].fulltrim().split(" ");
    if (line.length > 1) {
      switch (line[0]) {
        case "v":
          if (line.length >= 4) {
            v.push([
              parseFloatN(line[1]),
              parseFloatN(line[2]),
              parseFloatN(line[3]),
            ]);
          }
          break;
        case "vt":
          if (line.length >= 3) {
            vt.push([parseFloatN(line[1]), parseFloatN(line[2])]);
          }
          break;
        case "vn":
          if (line.length === 4) {
            vn.push([
              parseFloatN(line[1]),
              parseFloatN(line[2]),
              parseFloatN(line[3]),
            ]);
          }
          break;
        case "f":
          if (line.length === 4) {
            var f1 = line[1].split("/");
            var f2 = line[2].split("/");
            var f3 = line[3].split("/");
            var parseFace = function(face) {
              var index = { v: 0, vt: 0, vn: 0 };
              if (face.length >= 1) {
                index.v = parseIntN(face[0] - 1);
              }
              if (face.length === 3) {
                index.vt = parseIntN(face[1] - 1);
                index.vn = parseIntN(face[2] - 1);
              }
              return index;
            };
            f.push(parseFace(f1));
            f.push(parseFace(f2));
            f.push(parseFace(f3));
          }
          break;
      }
    }
  }

  for (var i = 0; i < f.length; i++) {
    json.indices.push(i);
    json.vertexPositions.push(v[f[i].v][0], v[f[i].v][1], v[f[i].v][2]);
    json.normals.push(vn[f[i].vn][0], vn[f[i].vn][1], vn[f[i].vn][2]);
    //json.texcoords.push(vt[f[i].vt][0], 1.0 - vt[f[i].vt][1]);
  }
  console.log(json);
  return json;
}
