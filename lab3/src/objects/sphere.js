class Sphere {
  constructor() {
    this.attribute_v_coord = 0;
    this.attribute_v_colours = 1;
    this.attribute_v_normals = 2;
    this.numspherevertices = 0;
  }

  /**
   *
   * @param {*} numlats
   * @param {*} numlongs
   * @param {WebGLRenderingContext} gl
   */
  makeSphere(numlats, numlongs, gl) {
    let i, j;
    let numvertices = 2 + (numlats - 1) * numlongs;

    this.numspherevertices = numvertices;
    this.numlats = numlats;
    this.numlongs = numlongs;

    // Figure this out
    let pVertices = new Float32Array(numvertices * 3);
    let pColours = new Float32Array(numvertices * 4);

    this.makeUnitSphere(pVertices);

    for (let i = 0; i < numvertices; i++) {
      pColours[i * 4] = pVertices[i * 3];
      pColours[i * 4 + 1] = pVertices[i * 3 + 1];
      pColours[i * 4 + 2] = pVertices[i * 3 + 2];
      pColours[i * 4 + 3] = 1;
    }

    /* Generate the vertex buffer object */
    this.sphereBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, pVertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /* Store the normals in a buffer object */
    this.sphereNormals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereNormals);
    gl.bufferData(gl.ARRAY_BUFFER, pVertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /* Store the colours in a buffer object */
    this.sphereColours = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereColours);
    gl.bufferData(gl.ARRAY_BUFFER, pColours, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let numindices =
      (this.numlongs * 2 + 2) * (this.numlats - 1) + (this.numlongs + 2) * 2;
    let pindices = new Float32Array(numindices);

    let index = 0;

    for (let i = 0; i < numlongs + 1; i++) {
      pindices[index++] = i;
    }
    pindices[index++] = 1;

    let start = 1;
    for (let j = 0; j < numlats - 2; j++) {
      for (let i = 0; i < numlongs; i++) {
        pindices[index++] = start + i;
        pindices[index++] = start + i + numlongs;
      }
      pindices[index++] = start; // close the triangle strip loop by going back to the first vertex in the loop
      pindices[index++] = start + numlongs; // close the triangle strip loop by going back to the first vertex in the loop

      start += numlongs;
    }

    // Define indices for the last triangle fan for the south pole region
    for (let i = numvertices - 1; i > numvertices - numlongs - 2; i--) {
      pindices[index++] = i;
    }
    pindices[index] = numvertices - 2; // Tie up last triangle in fan

    this.elementbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementbuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, pindices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  makeUnitSphere(pVertices) {
    let DEG_TO_RADIANS = 3.141592 / 180;
    let vnum = 0;
    let x, y, z, lat_radians, lon_radians;

    pVertices[0] = 0;
    pVertices[1] = 0;
    pVertices[2] = 1;
    vnum++;

    let latstep = 180 / this.numlats;
    let longstep = 360 / this.numlongs;

    /* Define vertices along latitude lines */
    for (let lat = 90 - latstep; lat > -90; lat -= latstep) {
      lat_radians = lat * DEG_TO_RADIANS;
      for (let lon = -180; lon < 180; lon += longstep) {
        lon_radians = lon * DEG_TO_RADIANS;

        x = Math.cos(lat_radians) * Math.cos(lon_radians);
        y = Math.cos(lat_radians) * Math.sin(lon_radians);
        z = Math.sin(lat_radians);

        /* Define the vertex */
        pVertices[vnum * 3] = x;
        pVertices[vnum * 3 + 1] = y;
        pVertices[vnum * 3 + 2] = z;
        vnum++;
      }
    }
    /* Define south pole */
    pVertices[vnum * 3] = 0;
    pVertices[vnum * 3 + 1] = 0;
    pVertices[vnum * 3 + 2] = -1;
  }

  /**
   *
   * @param {*} drawMode
   * @param {WebGLRenderingContext} gl
   */
  drawSphere(drawMode, gl, program) {
    let i;

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      this.sphereBufferObject,
    );
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.enableVertexAttribArray(2);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereNormals);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereColours);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    /* set the point size */
    //console.log("DOES THIS EXIST", gl.program);
    let pointSize = gl.getUniformLocation(program, "pointSize");
    gl.uniform1f(pointSize, 3);

    gl.cullFace(gl.FRONT_AND_BACK);

    // if (drawMode == 2) {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.numspherevertices);
    // } else {
    //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementbuffer);
    //   gl.drawElements(gl.TRIANGLE_FAN, this.numlongs + 2, gl.UNSIGNED_INT, 0);

    //   let lat_offset_jump = this.numlongs * 2 + 2;
    //   let lat_offset_start = this.numlongs + 2;
    //   let lat_offset_current = lat_offset_start * 4;

    //   let max_lat = this.numlats - 2;
    //   for (let i = 0; i < max_lat; i++) {
    //     gl.drawElements(
    //       gl.TRIANGLE_STRIP,
    //       this.numlongs * 2 + 2,
    //       gl.UNSIGNED_INT,
    //       lat_offset_current,
    //     );
    //     lat_offset_current += lat_offset_jump * 4;
    //   }
    //   /* Draw the south pole as a triangle fan */
    //   gl.drawElements(
    //     gl.TRIANGLE_FAN,
    //     this.numlongs + 2,
    //     gl.UNSIGNED_INT,
    //     lat_offset_current,
    //   );
    // }
  }
}

export default Sphere;
