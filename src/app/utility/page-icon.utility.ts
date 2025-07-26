import { Injectable } from '@angular/core';

export function setFaviconBeacon() : void {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '../assets/img/beacon-logo.svg';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  
export function setFaviconWaddle() : void {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '../assets/img/waddle-logo.svg';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  