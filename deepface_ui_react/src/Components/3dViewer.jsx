
import React, { Component } from "react";
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Button from '@mui/material/Button';
// import SendIcon from '@mui/icons-material/Send';
// import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { saveAs } from 'file-saver';
import JSZip from "jszip";
import { border } from "@mui/system";
import background from '../Assets/subbackground.png';
import CountUp from "react-countup";

class ThreeScene extends Component {

  fileName = 'vitya';

  componentDidMount() {



    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.scene = new THREE.Scene();

    //Add Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#1f2b4f");
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    //add Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 0;
    this.camera.position.y = 0;
    this.camera.position.x = 0.3;

    //Camera Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    //LIGHTS
    var lights = [];
    lights[0] = new THREE.PointLight(0x304ffe, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);
    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);

    //Simple Box with WireFrame
    this.addModels(this.fileName);

    this.renderScene();
    //start animation
    this.start();
  }

  addModels(fileName) {

    // -----Step 4--------
    //Loading 3d Models
    //Loading Material First
    var mtlLoader = new MTLLoader();
    mtlLoader.setPath("./assets/");
    console.log("set Path")
    mtlLoader.load(fileName + ".mtl", materials => {
      materials.preload();
      console.log("Material loaded");
      //Load Object Now and Set Material
      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        "./assets/" + fileName + ".obj",
        object => {
          this.freedomMesh = object;
          //or  this
          this.freedomMesh.scale.set(1, 1, 1);
          this.scene.add(this.freedomMesh);
        },
        xhr => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        error => {
          console.log("An error happened" + error);
        }
      );
    });
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    // -----Step 3--------
    //Rotate Models
    if (this.cube) this.cube.rotation.y += 0.01;
    if (this.freedomMesh) this.freedomMesh.rotation.y += 0.01;

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
  renderScene = () => {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  };
  onGetImageHandler = (e) => {
    e.preventDefault();

    fetch('http://localhost:8090/main/image',
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData)

        var b = Buffer.from(responseData.objUrl.$binary.base64, 'base64')
        var s = b.toString();
        var obj_a = Buffer.from(s, 'base64')

        b = Buffer.from(responseData.mtlUrl.$binary.base64, 'base64')
        s = b.toString();
        var mtl_a = Buffer.from(s, 'base64')

        b = Buffer.from(responseData.name.$binary.base64, 'base64')
        s = b.toString();
        var depth_a = Buffer.from(s, 'base64')

        b = Buffer.from(responseData.normalsUrl.$binary.base64, 'base64')
        s = b.toString();
        var normals_a = Buffer.from(s, 'base64')

        b = Buffer.from(responseData.pngUrl.$binary.base64, 'base64')
        s = b.toString();
        var png_a = Buffer.from(s, 'base64')

        b = Buffer.from(responseData.detailObjUrl.$binary.base64, 'base64')
        s = b.toString();
        var detail_a = Buffer.from(s, 'base64')

        var mtlBlob = new Blob([mtl_a], { type: 'text/plain' });

        var objBlob = new Blob([obj_a], { type: 'text/plain' });

        var depthBlob = new Blob([depth_a], { type: 'image/jpeg' });

        var normalsBlob = new Blob([normals_a], { type: 'image/png' });

        var pngBlob = new Blob([png_a], { type: 'image/png' });

        var detailBlob = new Blob([detail_a], { type: 'text/plain' });

        const zip = new JSZip();

        zip.file("vitya_depth" + ".jpg", depthBlob);
        zip.file("vitya_normals" + ".png", normalsBlob);
        zip.file("vitya" + ".png", pngBlob);
        zip.file("vitya_detail" + ".obj", detailBlob);
        zip.file("vitya" + ".mtl", mtlBlob);
        zip.file("vitya" + ".obj", objBlob);

        zip.generateAsync({ type: "blob" }).then((blob) => saveAs(blob, "deepcheap.zip"));
        return responseData;

      })
      .catch(error => console.warn(error));
  };


  render() {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}>
        <div style={{ width: "500px", height: "500px", border: '5px solid #333399', borderRadius: '10px', margin: '10px' }}>
          <img src={"../Assets/vitya.png"} width="500px" height="500px" />
        </div>
        <div style={{ width: "500px", height: "500px", border: '5px solid #333399', borderRadius: '10px', margin: '10px' }} ref={mount => { this.mount = mount; }}>
        </div>
        <div style={{ width: "500px", height: "500px", border: '5px solid #333399', borderRadius: '10px', margin: '10px',background: '#FFFFFF' }}>
          <table id="face-table">
            <tr>
              <th>AGE: </th>
              <td><CountUp end={50} duration={5}/></td>
            </tr>
            <tr>
              <th>SEX: </th>
              <td>MALE</td>
            </tr>
            <tr>
              <th>MOOD: </th>
              <td>NEUTRAL</td>
            </tr>
          </table>
        </div>

      </div>

    );
  }
}
export default ThreeScene;

