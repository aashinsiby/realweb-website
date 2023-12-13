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
  @ViewChild('down') modelContainer!: ElementRef;
  


  scrollToDown() {
    if (this.modelContainer) {
      const containerElement = this.modelContainer.nativeElement as HTMLElement;
      containerElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  model: THREE.Object3D = new THREE.Object3D();
  mixer: THREE.AnimationMixer | null = null;
  animations: THREE.AnimationClip[] = [];
  currentAnimationIndex = 0;
 isLoading: boolean = true;
 
  ngOnInit(): void {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.update();
    // controls.autoRotate = true;
    controls.enableZoom=false;
    controls.enablePan=false;
    controls.enableDamping = true;
   
   
    // const axesHelper = new THREE.AxesHelper(10); // Adjust the size as needed
    //   this.scene.add(axesHelper);
   
    
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
                        this.model.scale.set(.3 ,.3, .3);
                        this.model.position.set(5 ,-0.134, -0.840);
                        this.scene.add(this.model);
                        this.isLoading = false;
                        
                        // Initialize the mixer for animations
                        this.animations = gltf.animations;
                        if (this.animations.length > 0) {
                          this.mixer = new THREE.AnimationMixer(this.model);
                          const aspectRatio = window.innerWidth / window.innerHeight;




                          // Play the animations once
                      for (let i = 0; i < this.animations.length; i++) {
                                const action = this.mixer.clipAction(this.animations[i]);
                                  action.setLoop(THREE.LoopOnce, 0); // Set the loop mode to play once and repetitions to 1
                                action.clampWhenFinished = true; // Maintain the final state after the animation finishes
                                action.play();
                        }
                        

                    }
                    //rotate the object
      const degrees = 156;
      const radians = (degrees * Math.PI) / 180; 
      this.model.rotateY(radians); 

    });
  
    
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.mixer) { //----------------------------------------------------------------animation
        this.mixer.update(0.01);
        THREE.LoopOnce;
      }
     this.model.rotation.y += .005;
      controls.update();
      this.renderer.render(this.scene, this.camera);
      
    };
   //--------------------------lights---------------------------------------------------
    const pointLight = new THREE.PointLight(0xffffff, 25, 500);
    pointLight.position.set(5, 5, 0);
    this.scene.add(pointLight);

// const pointhelper = new THREE.PointLightHelper(pointLight, 1);
// this.scene.add(pointhelper);

    const pointLight1 = new THREE.PointLight(0xffffff, 25, 500);
    pointLight1.position.set(0, 2, 8);
    this.scene.add(pointLight1);

// const pointhelper1 = new THREE.PointLightHelper(pointLight1, 1);
// this.scene.add(pointhelper1);
    


     animate();
  
  }
 
}
