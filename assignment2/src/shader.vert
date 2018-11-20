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

    mat4 modelview = view * model;

    gl_Position = projection * modelview * vec4(position, 1.0);
    vec4 vertPos4 = modelview * vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = normal;
}