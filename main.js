import * as THREE from 'three';
import { Game } from './game.js';
import { SettingsManager } from './settings.js';
import { AudioSystem } from './audio.js';
import { SaveSystem } from './saveSystem.js';
import { Controls } from './controls.js';

const $=id=>document.getElementById(id);
const game=new Game($('world')); const settings=new SettingsManager(); const audio=new AudioSystem(); const saves=new SaveSystem();
const ui={loading:$('loading'),menu:$('menu'),trainSelect:$('trainSelect'),settings:$('settings'),credits:$('credits'),hud:$('hud'),pause:$('pause')};
let currentTrain='Japan Metro 6000-inspired', selectedRoute='urban', inGame=false, paused=false;
function showOnly(name){Object.values(ui).forEach(x=>x.classList.add('hidden'));ui[name].classList.remove('hidden');}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1900)}
const boot=async()=>{let p=0;const timer=setInterval(()=>{p=Math.min(94,p+Math.random()*13);$('progressBar').style.width=p+'%';$('loadingStatus').textContent=p<35?'Building the railway environment…':p<70?'Preparing train systems…':'Warming up the renderer…';},180);try{await game.init();}catch(e){console.error(e);toast('3D renderer failed. Check WebGL / internet connection.')}clearInterval(timer);$('progressBar').style.width='100%';$('loadingStatus').textContent='Ready to depart';setTimeout(()=>{showOnly('menu');},500)};
boot();
$('skipIntro').onclick=()=>{showOnly('menu');};
$('playBtn').onclick=()=>{audio.unlock();showOnly('trainSelect');game.showPreview(currentTrain);};
document.querySelectorAll('[data-screen]').forEach(b=>b.onclick=()=>{showOnly(b.dataset.screen);if(b.dataset.screen==='credits')game.setMenuScene('credits');if(b.dataset.screen==='settings')settings.render($('settingsList'),$('settingSearch').value);});
document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>{if(inGame){showOnly('pause');}else{showOnly('menu');game.setMenuScene('menu');}});
document.querySelectorAll('.train-option').forEach(b=>b.onclick=()=>{document.querySelectorAll('.train-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');currentTrain=b.dataset.train;game.showPreview(currentTrain);});
$('livery').onchange=()=>game.setLivery($('livery').value);
$('route').onchange=()=>selectedRoute=$('route').value;
$('confirmTrain').onclick=()=>{game.start(currentTrain,selectedRoute,$('livery').value);inGame=true;paused=false;showOnly('hud');$('routeName').textContent=selectedRoute==='urban'?'TOKYO URBAN LOOP':selectedRoute==='coast'?'INDONESIAN COASTAL CORRIDOR':'RURAL COUNTRYSIDE';audio.unlock();toast('Train ready. Release brakes, then apply power.');};
$('powerBtn').onclick=()=>{if(!inGame)return;game.setPower(Math.min(5,game.power+1));audio.unlock();updateStatus()};
$('brakeBtn').onclick=()=>{if(!inGame)return;game.setBrake(Math.min(5,game.brake+1));updateStatus()};
$('neutralBtn').onclick=()=>{game.setPower(0);game.setBrake(0);updateStatus()};
$('doorBtn').onclick=()=>{const ok=game.toggleDoors();if(!ok)toast('Doors locked while moving. Stop at a station first.');$('doorStatus').textContent=game.doorsOpen?'DOORS OPEN':'DOORS CLOSED';};
$('hornBtn').onpointerdown=()=>{audio.unlock();audio.horn(true)};$('hornBtn').onpointerup=()=>audio.horn(false);$('hornBtn').onpointerleave=()=>audio.horn(false);
$('lightBtn').onclick=()=>{game.headlights=!game.headlights;game.applyHeadlights();toast(game.headlights?'Headlights on':'Headlights off')};
$('cameraBtn').onclick=()=>{game.nextCamera();$('camStatus').textContent=game.cameraName;};
$('pauseBtn').onclick=()=>{paused=true;game.paused=true;showOnly('pause');audio.pause()};
$('resumeBtn').onclick=()=>{paused=false;game.paused=false;showOnly('hud');audio.resume()};
$('pauseSettings').onclick=()=>{showOnly('settings');settings.render($('settingsList'),$('settingSearch').value)};
$('quitBtn').onclick=()=>{inGame=false;paused=false;game.stop();audio.pause();showOnly('menu');game.setMenuScene('menu')};
$('settingSearch').oninput=()=>settings.render($('settingsList'),$('settingSearch').value);
$('resetSettings').onclick=()=>{settings.reset();settings.render($('settingsList'),$('settingSearch').value);toast('Settings restored')};
$('exportSettings').onclick=()=>{const blob=new Blob([JSON.stringify(settings.values,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='railway-settings.json';a.click();URL.revokeObjectURL(a.href)};
function updateStatus(){$('driveStatus').textContent=`POWER P${game.power} · BRAKE B${game.brake}`;}
new Controls(game,()=>{if(!paused)$('speed').textContent=Math.round(game.speed*3.6);});
window.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='Space'){e.preventDefault();game.setBrake(5);updateStatus()}if(e.code==='ArrowUp')game.setPower(Math.min(5,game.power+1));if(e.code==='ArrowDown')game.setBrake(Math.min(5,game.brake+1));if(e.code==='KeyC')game.nextCamera();if(e.code==='KeyH'){audio.unlock();audio.horn(true)}});
window.addEventListener('keyup',e=>{if(e.code==='Space')game.setBrake(0);if(e.code==='KeyH')audio.horn(false)});
window.addEventListener('beforeunload',()=>saves.save({train:currentTrain,route:selectedRoute,settings:settings.values}));
