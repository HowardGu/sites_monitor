/**/_jsload2&&_jsload2('copyrightctrl', 'x.extend(Jc.prototype,{yf:function(){this.D&&this.Ie(this.D)},initialize:function(a){Ec.prototype.initialize.call(this,a);this.Ba();this.zo();this.ca(a);return this.C},ca:function(a){var b=this;a.addEventListener("load",function(){b.zo()});a.addEventListener("moveend",function(){b.zo()});a.addEventListener("zoomend",function(){b.zo()});a.addEventListener("maptypechange",function(){b.C&&(b.C.style.color=b.D.oa().Im())})},Ba:function(){Ec.prototype.Ba.call(this);x.K.Ta(this.C,"BMap_cpyCtrl");var a= this.C.style;a.cursor="default";a.whiteSpace="nowrap";a.MozUserSelect="none";a.color=this.D.oa().Im();a.background="none";a.font="11px/15px "+G.fontFamily;Ec.prototype.Ur.call(this)},zo:function(){if(this.D&&this.C&&0!=this.bc.length)for(var a=0,b=this.bc.length;a<b;a++){this.D.ga();var c=this.D.Rb({x:0,y:0}),d=this.D.Rb({x:this.D.width,y:this.D.height}),c=new hb(c,d);if(this.bc[a].bounds&&c.xt(this.bc[a].bounds)==p){if(this.C)for(d=0;d<this.C.children.length;d++)if(this.C.children[d].getAttribute("_cid")== this.bc[a].id&&"none"!=this.C.children[d].style.display){this.C.children[d].style.display="none";return}}else if(this.C){for(var c=q,d=0,e=this.C.children.length;d<e;d++)if(this.C.children[d].getAttribute("_cid")==this.bc[a].id){c=o;this.C.children[d].style.display="inline";this.C.children[d].innerHTML!=this.bc[a].content&&(this.C.children[d].innerHTML=this.bc[a].content);break}c||this.br(this.bc[a])}}},zw:function(a){if(a&&Ya(a.id)&&!isNaN(a.id)){var b={bounds:p,content:""},c;for(c in a)b[c]=a[c]; if(a=this.ym(a.id))for(var d in b)a[d]=b[d];else this.bc.push(b);this.zo()}},ym:function(a){for(var b=0,c=this.bc.length;b<c;b++)if(this.bc[b].id==a)return this.bc[b]},VD:v("bc"),rF:function(a){for(var b,c=0,d=this.bc.length;c<d;c++)this.bc[c].id==a&&(b=this.bc.splice(c,1),c--,d=this.bc.length);(a=this.Jd(a))&&a.parentNode&&a.parentNode.removeChild(a);this.zo();return b},br:function(a){this.C&&(this.C.innerHTML+="<span _cid=\'"+a.id+"\'>"+a.content+"</span>")},Jd:function(a){var b=Ec.prototype.Jd.call(this); if(Ib(a)){if(b)for(var c=0,d=b.children.length;c<d;c++)if(b.children[c].getAttribute("_cid")==a)return b.children[c]}else return b}});U(Yf,{addCopyright:Yf.zw,removeCopyright:Yf.rF,getCopyright:Yf.ym,getCopyrightCollection:Yf.VD}); ');