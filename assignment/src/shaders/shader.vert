#version 300 es

/*
precision mediump float;

in vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}*/

// Starter vertex shader for lab3
// THe goal is to update this shader to implement Gourand shading
// which is per-vertex lighting

// These are the vertex attributes
layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;

// Uniform variables are passed in from the application
uniform mat4 model, view, projection;

// Output the vertex colour - to be rasterized into pixel fragments
out vec4 fcolour;

void main()
{
	vec3 light_direction = normalize(vec3(1,1,1));
	mat4 model_view = view * model;

	mat3 normal_matrix = transpose(inverse(mat3(model_view)));

	vec3 normalised_normal = normalize(normal_matrix * normal);

	vec4 vertex_position = vec4(position, 1.0);
	
	vec4 diffuse_colour;
	vec4 position_h = vec4(position, 1.0);
	
	float diffuse_component = max(dot(normalised_normal, light_direction), 0.0f);

	diffuse_colour = vec4(0.0, 1.0, 0, 1.0);

	// Define the vertex colour
	vec4 ambient = diffuse_colour * 0.2;

	vec4 diffuse_lighting = diffuse_component * diffuse_colour;

	fcolour = ambient + diffuse_lighting;

	// Define the vertex position
	gl_Position = projection * view * model * position_h;
}