#version 300 es

layout(location = 1) in vec3 position;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec3 colour;

uniform mat4 model, view, projection;
uniform vec4 light_direction4;
uniform int colourMode;

out vec3 lighting;
out vec4 fcolour;

void main(void) {
  fcolour = vec4(colour,1);
  vec4 position_h = vec4(position,1);
  gl_Position = projection * view * model * position_h;

  if(colourMode == 1){
    vec3 light_direction = normalize(light_direction4.xyz / light_direction4.w);
	  mat4 model_view = view * model;

	  mat3 normal_matrix = transpose(inverse(mat3(model)));
	  vec3 normalised_normal = normalize(normal_matrix * normal);

	  vec4 vertex_position = vec4(position, 1.0);
	  vec4 diffuse_colour;
	  vec4 position_h = vec4(position, 1.0);
	  float diffuse_component = max(dot(normalised_normal, light_direction), 0.0f);
	  diffuse_colour = vec4(0.6, 0.6, 0.6, 1.0);
	  vec4 ambient = diffuse_colour * 0.5f;
	  vec4 diffuse_lighting = diffuse_component * diffuse_colour;
	  lighting = (ambient + diffuse_lighting).xyz;
  } else if(colourMode == 2) {
    // Apply lighting effect
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(light_direction4.xyz);

    highp vec4 transformedNormal = model * vec4(normal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    lighting = ambientLight + (directionalLightColor * directional);
  }
}


//     }
// #version 300 es

// // These are the vertex attributes
// layout(location = 1) in vec3 position;
// layout(location = 2) in vec3 normal;
// layout(location = 3) in vec3 colour;

// // Uniform variables are passed in from the application
// uniform mat4 model, view, projection;
// uniform vec4 light_direction4;
// uniform int colourMode;

// // Output the vertex colour - to be rasterized into pixel fragments
// out vec4 fcolour;

// /*
// void main()
// {
//   // vec4 light_direction_view = light_direction4 * view;
// 	vec3 light_direction = normalize(light_direction4.xyz / light_direction_view.w);

// 	mat4 model_view = view * model;

// 	mat3 normal_matrix = transpose(inverse(mat3(model)));

// 	vec3 normalised_normal = normalize(normal_matrix * normal);

// 	vec4 vertex_position = vec4(position, 1.0);
	
// 	vec4 diffuse_colour;
// 	vec4 position_h = vec4(position, 1.0);
	
// 	float diffuse_component = max(dot(normalised_normal, light_direction), 0.0f);

// 	diffuse_colour = vec4(colour, 1.0);

// 	// Define the vertex colour
// 	vec4 ambient = diffuse_colour * 0.8f;

// 	vec4 diffuse_lighting = diffuse_component * diffuse_colour;

//   if(colourMode == 1) {
// 	  fcolour = ambient + diffuse_lighting;
//   }

// 	// Define the vertex position
// 	gl_Position = projection * view * model * position_h;
// }*/