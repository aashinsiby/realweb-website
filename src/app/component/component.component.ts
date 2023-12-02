import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnimationAction } from 'three';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component.component.html',
  styleUrl: './component.component.css'
})
export class ComponentComponent implements OnInit {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  model: THREE.Object3D = new THREE.Object3D();
  mixer: THREE.AnimationMixer | null = null;
  animations: THREE.AnimationClip[] = [];
  currentAnimationIndex = 0;

 
  ngOnInit(): void {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.update();
    controls.autoRotate = true;
    controls.enableZoom = false;
    const resizeRendererToDisplaySize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
  
      const aspectRatio = width / height;
      this.camera.aspect = aspectRatio;
      this.camera.updateProjectionMatrix();
  
      this.renderer.setSize((width -20), height);
    };
    
    this.renderer.setClearColor(0x00000);
    
    this.camera.position.set(0, 0, 10);
    

  window.addEventListener('resize', resizeRendererToDisplaySize);
  resizeRendererToDisplaySize();
 
    const container = document.querySelector('.model-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  
                  //---------------------------------------------load model--------------------------------
    const loader = new GLTFLoader();
    loader.load('assets/logo.glb', (gltf) => {
      this.model = gltf.scene;
      this.model.scale.set(.5 ,.5, .5);
      this.scene.add(this.model);

     
                                                    //----------animation--------------------
      this.animations = gltf.animations;
      if (this.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.model);
        
        // Declare actions explicitly as an array of AnimationAction
        const actions: AnimationAction[] = [];
        
        // Play the animations forward
        for (let i = 0; i < this.animations.length; i++) {
          const action = this.mixer.clipAction(this.animations[i]);
          actions.push(action);
          action.play();
        }
        
        // Wait for some time (you can use setTimeout or any event to trigger the pause)
        // For example, pausing after 3 seconds:
        setTimeout(() => {
          // Pause the animations
          actions.forEach(action => {
            action.timeScale = 0; // Set timeScale to 0 to pause the animation
          });
        }, 3000); // 3 seconds delay before pausing (adjust as needed)
      }
      
    });
  
    
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.mixer) { //----------------------------------------------------------------animation
        this.mixer.update(0.01);
      }
     
      controls.update();
      this.renderer.render(this.scene, this.camera);
      
    };
   //--------------------------lights---------------------------------------------------
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5); 
    directionalLight.position.set(1, 1, 1); 
    this.scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight2.position.set(-1,-1,-1)
    this.scene.add(directionalLight2);
   
    
    animate();
  
  }
 
}
