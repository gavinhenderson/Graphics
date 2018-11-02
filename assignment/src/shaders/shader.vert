#version 300 es

// These are the vertex attributes
layout(location = 1) in vec3 position;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec3 colour;

// Uniform variables are passed in from the application
uniform mat4 model, view, projection;
uniform vec4 light_direction4;
uniform int colourMode;

// Output the vertex colour - to be rasterized into pixel fragments
out vec4 fcolour;

void main()
{
  vec4 light_direction_view = light_direction4 * view;
	vec3 light_direction = normalize(light_direction_view.xyz / light_direction_view.w);

	mat4 model_view = view * model;

	mat3 normal_matrix = transpose(inverse(mat3(model_view)));

	vec3 normalised_normal = normalize(normal_matrix * normal);

	vec4 vertex_position = vec4(position, 1.0);
	
	vec4 diffuse_colour;
	vec4 position_h = vec4(position, 1.0);
	
	float diffuse_component = max(dot(normalised_normal, light_direction), 0.0f);

	diffuse_colour = vec4(colour, 1.0);

	// Define the vertex colour
	vec4 ambient = diffuse_colour * 0.1;

	vec4 diffuse_lighting = diffuse_component * diffuse_colour;

  if(colourMode == 1) {
	  fcolour = ambient + diffuse_lighting;
  }

	// Define the vertex position
	gl_Position = projection * view * model * position_h;
}