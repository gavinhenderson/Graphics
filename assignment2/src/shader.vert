#version 300 es

layout(location = 1) in vec3 position;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec2 texcoord;

uniform mat4 projection, model, view;

out vec3 normalInterp;
out vec3 vertPos;
out vec2 ftexcoord;

void main(){
    ftexcoord = texcoord;

    mat4 normalMat = transpose(inverse(model));

    mat4 modelview = view * model;

    gl_Position = projection * modelview * vec4(position, 1.0);
    vec4 vertPos4 = modelview * vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(normalMat * vec4(normal, 0.0));
}

/*
layout(location = 1) in vec3 position;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec2 texcoord;

uniform mat4 model, view, projection;
uniform vec4 light_direction4;
uniform vec3 point_light_pos;

out vec3 lighting;
out vec4 fcolour;
out vec2 ftexcoord;

void main(void) {
  ftexcoord = texcoord;

  fcolour = vec4(1,0,0,1);
  vec4 position_h = vec4(position,1);
  gl_Position = projection * view * model * position_h;

  vec3 light_direction = normalize(light_direction4.xyz / light_direction4.w);
  mat4 model_view = view * model;

  mat3 normal_matrix = transpose(inverse(mat3(model)));
  vec3 normalised_normal = normalize(normal_matrix * normal);

  vec4 vertex_position = vec4(position, 1.0);
  vec4 diffuse_colour;
  float diffuse_component = max(dot(normalised_normal, light_direction), 0.0f);
  diffuse_colour = vec4(0.5, 0.5, 0.5, 1.0);
  vec4 ambient = diffuse_colour * 0.5f;
  vec4 diffuse_lighting = diffuse_component * diffuse_colour;
  lighting = (ambient + diffuse_lighting).xyz;

}
*/