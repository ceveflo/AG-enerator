var window = [];

function callWindow(MenuName,Params){
  this[MenuName](Params);
}

function closeWindow(){
    openWindow.close();
    if(typeof prevWindow != undefined)
        openWindow = prevWindow;
}

function StarScreen(p){
    window[0] = new Window ('dialog {text: "AG Generator", properties: {closeButton: false, borderless: true},winID: 0}');
    var w = window[0];
    w.margin = 0;
    w.spacing = 0;
    w.mainScreen = w.add ('group {preferredSize: [450, 342], orientation: "column", alignChildren: ["fill","fill"]}');
    
    w.header = w.mainScreen.add ('group {preferredSize: [450, 60], alignment: "top", alignChildren: ["fill","center"]}');
    w.header.margin = 0;
    w.header.spacing = 0;
    w.header.add ("image", undefined, File (coreFolder+"images/core_logoAG.png"));
    w.headerText = w.header.add("statictext", undefined, undefined, {multiline: true});
    w.headerText.text ='Bienvenidos al nuevo sistema generador de plantillas de Adicción Gamer';
    w.headerText.justify = "center";
    
    
    w.main = w.mainScreen.add ('group {preferredSize: [450, 300], orientation: "column", alignment: "top", alignChildren: ["fill","fill"]}');
    w.buttons = w.main.add ('panel {text: "Seleccionar tarea", preferredSize: [-1, 250]}');
    w.buttons.columns = [];
    w.buttons.columns[0] = w.buttons.add ('group {preferredSize: [450, 100], orientation: "row", alignment: "top", alignChildren: ["fill","fill"]}');
    w.buttons.columns[1] = w.buttons.add ('group {preferredSize: [450, 100], orientation: "row", alignment: "top", alignChildren: ["fill","fill"]}');
    
    var post_image = {a: File (coreFolder+"images/core_image.png"),b: File (coreFolder+"images/core_image.png"),c: File (coreFolder+"images/core_image.png"),d: File (coreFolder+"images/core_image.png")};
    var post_hdr = {a:File (coreFolder+"images/core_hdr.png"),b:File (coreFolder+"images/core_hdr.png"),c:File (coreFolder+"images/core_hdr.png"),d:File (coreFolder+"images/core_hdr.png")}
    var vrs_image = {a:File (coreFolder+"images/core_vrs.png"),b:File (coreFolder+"images/core_vrs.png"),c:File (coreFolder+"images/core_vrs.png"),d:File (coreFolder+"images/core_vrs.png")}
    var post_meme = {a:File (coreFolder+"images/core_meme.png"),b:File (coreFolder+"images/core_meme.png"),c:File (coreFolder+"images/core_meme.png"),d:File (coreFolder+"images/core_meme.png")}
    
    
    
    w.buttons.createPost = w.buttons.columns[0].add ("iconbutton", undefined, ScriptUI.newImage (post_image.a, post_image.b, post_image.c, post_image.d));
    w.buttons.createPost.customTextHover = "Crea un post de imagen normal";
    w.buttons.createPost.tmplType = 'image';
    w.buttons.createPost.btnAction = 'newProject';
    w.buttons.vrsImage = w.buttons.columns[0].add ("iconbutton", undefined, ScriptUI.newImage (vrs_image.a, vrs_image.b, vrs_image.c, vrs_image.d));
    w.buttons.vrsImage.customTextHover = "Crea un post Versus (FB reactions)";
    w.buttons.vrsImage.tmplType = 'versus';
    w.buttons.vrsImage.btnAction = 'newProject';
    w.buttons.Meme = w.buttons.columns[0].add ("iconbutton", undefined, ScriptUI.newImage (post_meme.a, post_meme.b, post_meme.c, post_meme.d));
    w.buttons.Meme.customTextHover = "Crea un post MEME";
    w.buttons.Meme.tmplType = 'meme';
    w.buttons.Meme.btnAction = 'newProject';
    
    
    w.tooltip = w.main.add ('panel {preferredSize: [-1, 40], alignChildren: ["fill","fill"], borderless: true}');
    w.tooltip.margin = 0;
    w.tooltip.spacing = 0; 
    w.description = w.tooltip.add("statictext", undefined, "\n");
    
    
    w.bottons = w.mainScreen.add ('group {preferredSize: [450, 20], alignment: "top", alignChildren: ["fill","top"]}'); 
    w.preferencias = w.bottons.add ('button {text: "Preferencias"}');
    w.cerrar = w.bottons.add ('button {text: "Cerrar"}');
    w.cerrar.onClick = closeWindow;
    w.preferencias.onClick = preferenciasWindow;
    
    var mouseEventHandler = function(event,dom) {
        var tooltypeText = dom.customTextHover;
        var elemAction = dom.btnAction;
        var elemtTmpl = dom.tmplType;
        switch (event.type) {  
            case 'mouseover':   
                w.description.text = tooltypeText;
                break;
            case 'mouseout':   
                w.description.text = "";
                break;
            case 'click':
                callWindow(elemAction,elemtTmpl);
                break;
            default:   
                w.description.text = "";
        }
    } 

    
      
//    w.buttons.createPost.addEventListener('mouseover', function(e){}(mouseEventHandler(e,this)), false); 
// w.buttons.createPost.addEventListener('mouseout', mouseEventHandler, false);
        
    for (var i = 0; i < w.buttons.columns[0].children.length; i++) {
        w.buttons.columns[0].children[i].addEventListener('mouseover', function(event){mouseEventHandler(event,this)}); 
        w.buttons.columns[0].children[i].addEventListener('mouseout', function(event){mouseEventHandler(event,this)});
        w.buttons.columns[0].children[i].addEventListener('click', function(event){mouseEventHandler(event,this)});
    }

    for (var i = 0; i < w.buttons.columns[1].children.length; i++) {
        w.buttons.columns[1].children[i].addEventListener('mouseover', function(event){mouseEventHandler(event,this)}); 
        w.buttons.columns[1].children[i].addEventListener('mouseout', function(event){mouseEventHandler(event,this)});
        w.buttons.columns[1].children[i].addEventListener('click', function(event){mouseEventHandler(event,this)});
    }
    
    openWindow  = w;
    w.show();
}

function newProject(p){        
        window[1] = new Window ('dialog {text: "AG Generator - Nuevo Proyecto", alignChildren: ["fill","fill"], winID: 1}');
        var w = window[1];
        var pnl = [];
        pnl[0] = w.add('panel {text: "Nuevo Projecto",orientation: "column"}');
        with(pnl[0]){
            pnl[0].mainScreen = add ('group {preferredSize: [450, 60], orientation: "column", alignChildren: ["fill","fill"]}');
            pnl[0].panel = pnl[0].mainScreen.add ('panel {text: "Proyecto", preferredSize: [-1, 40], orientation: "row",alignChildren:["fill","center"]}');
            pnl[0].mainScreen.labelBox = pnl[0].panel.add('statictext', undefined, 'Nombre');
            pnl[0].mainScreen.textBox = pnl[0].panel.add('edittext', undefined, "",{readonly: false});
            pnl[0].mainScreen.textBox.size = [360,20]
        }
        pnl[1] = w.add('panel {text: "Abrir Projecto",orientation: "column"}');
        with(pnl[1]){
            pnl[1].mainScreen = add ('group {preferredSize: [450, 60], orientation: "column", alignChildren: ["fill","fill"]}');
            pnl[1].panel = pnl[1].mainScreen.add ('panel {text: "Proyecto", preferredSize: [-1, 40], orientation: "row",alignChildren:["fill","center"]}');
            pnl[1].mainScreen.labelBox = pnl[1].panel.add('statictext', undefined, 'Nombre');
            pnl[1].mainScreen.textBox = pnl[1].panel.add('edittext', undefined, "",{readonly: true});
            pnl[1].mainScreen.textBox.size = [280,20];
            pnl[1].mainScreen.textBox.enabled = false;
            pnl[1].mainScreen.btnBox = pnl[1].panel.add('button', undefined, '...'); 
            pnl[1].mainScreen.btnBox.onClick = (function(){return function(){
                projectFolder = Folder(projects).selectDlg("Selecciona un Projecto");
                if(projectFolder == null) 
                    return;
                pnl[1].mainScreen.textBox.text = projectFolder.name;
                //$.evalFile (openProject);
                var _obj = OpenFolder(projectFolder);
                projectObject = readJson(_obj);
            }})();
        }
    
        pnl[3] = w.add('panel {orientation: "column"}');
        with(pnl[3]){
            pnl[3].mainScreen = add ('group {preferredSize: [450, 60], orientation: "row", alignChildren: ["fill","fill"]}');
            pnl[3].create = pnl[3].mainScreen.add ('button {text: "Crear Proyecto"}');
            pnl[3].cerrar = pnl[3].mainScreen.add ('button {text: "Cerrar"}');
            pnl[3].cerrar.onClick = closeWindow;
            pnl[3].create.onClick = setNewProyectName;
        }        
        
        
        prevWindow = openWindow;
        openWindow  = w;
        w.show();
        
         function setNewProyectName(){
             if(pnl[1].mainScreen.textBox.text == ""){
                 var name = pnl[0].mainScreen.textBox.text.replace(/ /g,'');
                 if(name.length < 1)
                   return;
                 projectName = name;
                 projectObject = getDefaulProjectObjetc(p,name);
                 generateProject_file(projectName,projectObject);
                 closeWindow();
                 callWindow ("ProjectScreen");
             }else{
                 closeWindow();
                 callWindow ("ProjectScreen");                 
             }
         }
        
}


function ProjectScreen(){
    
    var fileNumer      = projectObject.fileNumber,
    tag                = projectObject.text.tag,
    t_top             = projectObject.text.top,
    t_btn             = projectObject.text.bottom,
    t_dsc             = projectObject.text.description,
    reactions       = projectObject.reactions,
    imageData     = projectObject.files,
    thumbsData   = projectObject.thumbs,
    colors            = projectObject.Colors;
    
    var formPanel      = ["","","",""],
    imgPnl           = ["","","",""];
    textPnl           = ["","","",""];
    
    var chk_txt = [];
    var radiosSelect = [];
    
    
    window[2] = new Window ('dialog {text: "AG Generator - '+ projectObject.ProjectName+'", orientation: "column", alignChildren: ["fill","fill"], winID: 2}');
    var w  = window[2];
    w.spacing = 0;
    w.mainScreen = w.add ('group {preferredSize: [450, 342], alignChildren: ["left","fill"]}');
    w.stubs = w.mainScreen.add ('listbox', undefined, ['Archivos', 'Textos', 'Color y Mascaras', 'Fuentes', 'Reacciones'], {scrolling: false});
    w.stubs.preferredSize.width = 120;
    
     /*with(w.stubs){
            items[1].enabled = false;
            for (var i = 0; i < items.length; i++) {
                items[i].enabled = false;
            }
            items[0].enabled = true;
     }*/
    
    w.tabGroup = w.mainScreen.add ('group {alignment: ["fill","fill"], orientation: "stack"}');
    w.tabs = [];
    
    w.tabs[0] = w.tabGroup.add ('group');
    w.tabs[0].add ('statictext {text: "Archivos"}');
    w.tabs[0].add ('panel');
    with (w.tabs[0]) {
        w.tabs[0][0] = w.tabs[0].add ('panel {text: "Numero de archivos", preferredSize: [-1, 40], orientation: "row",alignChildren:["fill","center"]}');
        with (w.tabs[0][0]) {            
            for (var i = 0; i < 4; i++) {
                radiosSelect[i] = add('radiobutton {text: '+(i+1)+'}');
                radiosSelect[i].enabled = (radioEnabled(i));
                radiosSelect[i].value = (radioValue(i));
                children[i].addEventListener('click', function(event){verifyCheck(this)});
            }
        }
    
        w.tabs[0][1] = w.tabs[0].add ('panel {text: "Selección de archivos", preferredSize: [-1, 100], orientation: "column",alignChildren:["fill","center"]}');
        with(w.tabs[0][1]){
            formPanel = [];
            for(var i = 0; i < 4; i++){
                  formPanel[i] = add('panel {orientation: "row"}');
                  formPanel[i].labelBox = formPanel[i].add('statictext', undefined, 'Imagen '+(i+1)+':');
                  formPanel[i].textBox = formPanel[i].add('edittext', undefined, getFileName (i),{readonly: true });
                  formPanel[i].textBox.size = [300,20]
                  formPanel[i].btnBox = formPanel[i].add('button', undefined, '...'); 
                  formPanel[i].btnBox.onClick = (function(i){return function(){addFileData(i,formPanel[i].textBox)}})(i);
                  formPanel[i].enabled = ( ((projectObject.type == "image" || projectObject.type == "meme") && i == 0 ) ? true: false);
            }
        }
    
        w.tabs[0][2] = add ('panel {text: "Vista Previa (Click para Eliminar)", preferredSize: [-1, 120], orientation: "column",alignChildren:["fill","center"]}');
        with(w.tabs[0][2]){
            var imgGroup = add('group {orientation: "row",alignChildren:["left","center"]}');
            with(imgGroup){
                var plhImage = new File(coreFolder+"images/core_holder.png")

                
                for (var i = 0; i < 4; i++) {
                    var setted = false;
                    imgPnl[i] = add('panel {preferredSize: [75, 75]}');                    
                    
                    if(thumbsData.length != 0 && i < thumbsData.length){
                        var simage = new File(projectFolder +"/images/" + thumbsData[i]); 
                        imgPnl[i].imagePreview =  imgPnl[i].add('image', undefined,simage);
                        setted = true;
                    }else{
                        imgPnl[i].imagePreview =  imgPnl[i].add('image', undefined,plhImage);                        
                    }
               
                    //imgPnl[i].imagePreview =  imgPnl[i].add('image', undefined,plhImage);
                    imgPnl[i].imagePreview.size =  [75,75];
                    imgPnl[i].imagePreview.isseted =  setted;
                    imgPnl[i].imagePreview.onClick = (function(i){return function(){ deleteData(i) }})(i);
                    
                }
                
            }
            var refreshBtn = add('button',undefined,"Refrescar")
            refreshBtn.onClick = (function(){return function(){ alert('Recargado')}})()
        }
    }

    w.tabs[1] = w.tabGroup.add ('group');
    w.tabs[1].add ('statictext {text: "Textos"}');
    w.tabs[1].add ('panel');
   with (w.tabs[1]) {
        w.tabs[1][0] = add ('panel {text: "Seleccion de tag", preferredSize: [-1, 40], orientation: "column",alignChildren:["fill","center"]}');
        with (w.tabs[1][0]) {
            add('checkbox {text: "Habilitar tag", value: '+ (projectObject.text.tag.text != "" || projectObject.text.tag.index != -1) +',enabled: '+projectObject.text.tag.enable+'}');
            textPnl[0] = add ('group {orientation: "column",alignChildren:["fill","center"]}');
            with(textPnl[0]){ 
                textPnl[0][0] = add ('group {orientation: "column",alignChildren:["fill","center"],visible: '+ (projectObject.text.tag.text != "" || projectObject.text.tag.index != -1) +'}');
                with(textPnl[0][0]){
                        add ('statictext {text: "Lista de tags"}');
                        textPnl[0][0].Dropdown = add ("dropdownlist", undefined, tagTypes);  
                        textPnl[0][0].Dropdown.selection = (projectObject.text.tag.index == -1 ? 0 : projectObject.text.tag.index);
                }
                textPnl[0][1] = add ('group {orientation: "column",alignChildren:["fill","center"]}')
                textPnl[0][1].visible =  (projectObject.text.tag.text != "") ;
                with(textPnl[0][1]){
                        add ('statictext {text: "Escriba el tag"}');
                        textPnl[0][1].tagCustom = add("edittext",undefined,projectObject.text.tag.text);  
                }                
                textPnl[0][0].Dropdown.onChange = function (){
                    if (textPnl[0][0].Dropdown.selection == tagTypes.length -1){
                        textPnl[0][1].visible = true;
                        projectObject.text.tag.index =  tagTypes.length -1;
                    }else{
                        textPnl[0][1].visible = false;
                        textPnl[0][1].text = "";
                        //projectObject.text.tag.index = textPnl[0][0].Dropdown.selection;
                    }
                }
              
            }
            
            with(children[0]){
                addEventListener('click', function(event){
                        if(value == true){
                            tag = true;
                            textPnl[0][0].visible = true;
                            projectObject.text.tag.enable = true;
                        }else{
                            tag = false;
                            textPnl[0][0].visible = false;
                            textPnl[0][1].visible = false;
                            projectObject.text.tag.enable = false;
                        }
                 });
            }
        }
    }

   with (w.tabs[1]) {
            w.tabs[1][1] = add ('panel {text: "Textos [Arriba,Abajo,Descripcion]", preferredSize: [-1, 40], orientation: "column",alignChildren:["fill","center"]}');
            with (w.tabs[1][1]) {                
                chk_txt[0] = add ('checkbox {text: "Habilitar texto Superior", value:'+ (projectObject.text.top.text != "") +', enabled: '+ (projectObject.text.top.enable || projectObject.text.top.text != "" )+'}');
                textPnl[1] = add ('group {orientation: "column",alignChildren:["fill","center"]}');
                with(textPnl[1]){ 
                    textPnl[1][0] = add ('group {orientation: "row",alignChildren:["fill","fill"]}');
                    textPnl[1][0].visible = (projectObject.text.top.text != "");
                    with(textPnl[1][0]){
                            add ('statictext {text: "Ingrese el texto"}');
                            textPnl[1][0].textBox = add("edittext",undefined,projectObject.text.top.text);
                            textPnl[1][0].textBox.size = [280,20]
                    }
                }
                chk_txt[1] = add ('checkbox {text: "Habilitar texto Inferior", value: '+ (projectObject.text.bottom.text != "" )+', enabled: '+ (projectObject.text.bottom.enable || projectObject.text.bottom.text != "")+'}');
                textPnl[2] = add ('group {orientation: "column",alignChildren:["fill","center"]}');
                with(textPnl[2]){ 
                    textPnl[2][0] = add ('group {orientation: "row",alignChildren:["fill","fill"]}');
                    textPnl[2][0].visible = (projectObject.text.bottom.text != "");
                    with(textPnl[2][0]){
                            add ('statictext {text: "Ingrese el texto"}');
                            textPnl[2][0].textBox = add("edittext",undefined,projectObject.text.bottom.text);
                            textPnl[2][0].textBox.size = [280,20]
                    }
                }
                chk_txt[2] = add ('checkbox {text: "Habilitar texto Largo", value:'+ (projectObject.text.description.text != "") +', enabled: '+ (projectObject.text.description.enable || projectObject.text.description.text != "") +'}');
                textPnl[3] = add ('group {orientation: "column",alignChildren:["fill","center"]}');
                with(textPnl[3]){ 
                    textPnl[3][0] = add ('group {orientation: "column",alignChildren:["fill","fill"]}');
                    textPnl[3][0].visible = (projectObject.text.description.text != "")
                    with(textPnl[3][0]){
                            add ('statictext {text: "Ingrese el texto"}');
                            textPnl[3][0].textBox = add("edittext",undefined,projectObject.text.description.text,{multiline: true});
                            textPnl[3][0].textBox.size = ["",150]
                    }
                }
            
                for (var i = 0; i < chk_txt.length ; i++) {
                    with(chk_txt[i]){
                          addEventListener('click', (function(i){ return function(){
                                if(value == true){
                                    textPnl[i+1][0].visible = true;
                                }else{
                                    textPnl[i+1][0].visible = false;
                                }
                          }})(i));
                    }
                }           
             }
   }
            
   w.tabs[2] = w.tabGroup.add ('group');
   w.tabs[2].add ('statictext {text: "Color y Mascaras"}');
   w.tabs[2].add ('panel');
   with (w.tabs[2]) {
        var colorChk  = [],
        colorBtn = [],
        newColor = [];
        
        colorChk[0] = add ('checkbox {text: "Habilitar color: TAG", value: '+!projectObject.text.tag.enable+', enabled: '+projectObject.text.tag.enable+'}');
        var pnl = [];
        pnl[0] = add('panel {text: "Color: TAG", orientation: "row", alignChildren:["fill","fill"],enabled: false}');
        pnl[0].g = [];
        pnl[0].g[0] = pnl[0].add('group {orientation: "column", alignChildren:["fill","fill"]}')
        with(pnl[0].g[0]){
            add('statictext {text: "Color Icono"}')
            colorBtn[0] = add('iconbutton', undefined, undefined, {name:'tag-icon', style: 'toolbutton'});
            colorBtn[0].name = "tag-icon";
            colorBtn[0].size = [50,35];
            colorBtn[0].fillBrush = colorBtn[0].graphics.newBrush( colorBtn[0].graphics.BrushType.SOLID_COLOR, projectObject.colors["tag-icon"] );
            colorBtn[0].text = "";
            colorBtn[0].textPen = colorBtn[0].graphics.newPen (colorBtn[0].graphics.PenType.SOLID_COLOR,[1,1,1], 1);
            colorBtn[0].onDraw = customDraw;
        }
        pnl[0].g[1] = pnl[0].add('group {orientation: "column",alignChildren:["fill","fill"]}')
        with(pnl[0].g[1]){
            add('statictext {text: "Color Fondo"}')
            colorBtn[1]= add('iconbutton', undefined, undefined, {name:'tag-bg', style: 'toolbutton'});
            colorBtn[1].name = "tag-bg";
            colorBtn[1].size = [50,35];
            colorBtn[1].fillBrush = colorBtn[1].graphics.newBrush( colorBtn[1].graphics.BrushType.SOLID_COLOR, projectObject.colors["tag-bg"] );
            colorBtn[1].text = "";
            colorBtn[1].textPen = colorBtn[1].graphics.newPen (colorBtn[1].graphics.PenType.SOLID_COLOR,[1,1,1], 1);
            colorBtn[1].onDraw = customDraw;
        }
    
        pnl[0].g[2] = pnl[0].add('group {orientation: "column",alignChildren:["fill","fill"]}')
        with(pnl[0].g[2]){
            add('statictext {text: "Color Texto"}')
            colorBtn[5]= add('iconbutton', undefined, undefined, {name:'tag-bg', style: 'toolbutton'});
            colorBtn[5].name = "tag-text";
            colorBtn[5].size = [50,35];
            colorBtn[5].fillBrush = colorBtn[5].graphics.newBrush( colorBtn[5].graphics.BrushType.SOLID_COLOR, projectObject.colors["tag-text"] );
            colorBtn[5].text = "";
            colorBtn[5].textPen = colorBtn[5].graphics.newPen (colorBtn[5].graphics.PenType.SOLID_COLOR,[1,1,1], 1);
            colorBtn[5].onDraw = customDraw;
        }
    
        colorChk[1] = add ('checkbox {text: "Habilitar color: Texto", value: '+!(projectObject.text.top.enable || projectObject.text.bottom.enable || projectObject.text.description.enable)+', enabled: '+(projectObject.text.top.enable || projectObject.text.bottom.enable || projectObject.text.description.enable)+'}');
        pnl[1] = add('panel {text: "Color: TEXTO", orientation: "row", alignChildren:["fill","fill"], enabled:false}');
        
        pnl[1].g = [];
        pnl[1].g[0] = pnl[1].add('group {orientation: "column", alignChildren:["fill","fill"]}')
        with(pnl[1].g[0]){
            //add('statictext {text: "Color 1"}')
            colorBtn[2] = add('iconbutton', undefined, undefined, {name:'text', style: 'toolbutton'});
            colorBtn[2].name = "text";
            colorBtn[2].size = [50,35];
            colorBtn[2].fillBrush = colorBtn[2].graphics.newBrush( colorBtn[2].graphics.BrushType.SOLID_COLOR, projectObject.colors.text );
            colorBtn[2].text = "";
            colorBtn[2].textPen = colorBtn[2].graphics.newPen (colorBtn[2].graphics.PenType.SOLID_COLOR,[1,1,1], 1);
            colorBtn[2].onDraw = customDraw;
        }
    
        colorChk[2] = add ('checkbox {text: "Habilitar color: Mascara", value: '+!(projectObject.text.top.enable || projectObject.text.bottom.enable || projectObject.text.description.enable)+', enabled: '+(projectObject.text.top.enable || projectObject.text.bottom.enable || projectObject.text.description.enable)+'}');
        pnl[2] = add('panel {text: "Color: MASCARA", orientation: "row", alignChildren:["fill","fill"], enabled:false}');
        
        pnl[2].g = [];
        pnl[2].g[0] = pnl[2].add('group {orientation: "column", alignChildren:["fill","fill"]}')
        with(pnl[2].g[0]){
            //add('statictext {text: "Color 1"}')
            colorBtn[3] = add('iconbutton', undefined, undefined, {name:'mask', style: 'toolbutton'});
            colorBtn[3].name = "mask";
            colorBtn[3].size = [50,35];
            colorBtn[3].fillBrush = colorBtn[3].graphics.newBrush( colorBtn[3].graphics.BrushType.SOLID_COLOR, projectObject.colors.mask );
            colorBtn[3].text = "";
            colorBtn[3].textPen = colorBtn[3].graphics.newPen (colorBtn[3].graphics.PenType.SOLID_COLOR,[1,1,1], 1);
            colorBtn[3].onDraw = customDraw;
        }    

        colorChk[3] = add ('checkbox {text: "Habilitar color: Background", value: false, enabled: true}');
        pnl[3] = add('panel {text: "Color: BACKGROUND", orientation: "row", alignChildren:["fill","fill"], enabled:false}');
        
        pnl[3].g = [];
        pnl[3].g[0] = pnl[3].add('group {orientation: "column", alignChildren:["fill","fill"]}')
        with(pnl[3].g[0]){
            //add('statictext {text: "Color 1"}')
            colorBtn[4] = add('iconbutton', undefined, undefined, {name:'mask', style: 'toolbutton'});
            colorBtn[4].name = "background";
            colorBtn[4].size = [50,35];
            colorBtn[4].fillBrush = colorBtn[4].graphics.newBrush( colorBtn[4].graphics.BrushType.SOLID_COLOR, projectObject.colors.background );
            colorBtn[4].text = "";
            colorBtn[4].textPen = colorBtn[4].graphics.newPen (colorBtn[4].graphics.PenType.SOLID_COLOR,[1,1,1], 1);
            colorBtn[4].onDraw = customDraw;
        }    
    
        for (var i = 0; i < colorBtn.length ; i++) {
            with(colorBtn[i]){
                addEventListener('click', (function(i){return function(){
                        newColor[i] = colorpicker ();
                        fillBrush = graphics.newBrush(graphics.BrushType.SOLID_COLOR,newColor[i]);
                        onDraw = customDraw;
                        var cbtn_name = colorBtn[i].name;
                        projectObject.colors[cbtn_name] = newColor[i] ;
                        alert("Color seleccionado");
                }})(i));
            }
        }
        for (var i = 0; i < colorChk.length ; i++) {
            with(colorChk[i]){
                addEventListener('click', (function(i){return function(){
                    if(value == true){
                        pnl[i].enabled = true;
                    }else{
                        pnl[i].enabled = false;
                    }
                 }})(i))
            }
         }
        
    }
   w.tabs[3] = w.tabGroup.add ('group');
   w.tabs[3].add ('statictext {text: "Fuentes"}');
   w.tabs[3].add ('panel');
   with (w.tabs[3]) {
        var pnlFu = add('panel {text:"Lista de Fuentes",orientation:"row",alignChildren:["left","fill"], enabled:false}');
        with(pnlFu){
            add ("statictext", undefined, "Las fuentes no pueden ser modificadas en este momento, espera más actualizaciones :D", {multiline: true});
        }
    }
   w.tabs[4] = w.tabGroup.add ('group');
   w.tabs[4].add ('statictext {text: "Reacciones"}');
   w.tabs[4].add ('panel');
   with (w.tabs[4]) {
        var chkRe = add ('checkbox {text: "Habilitar edición de orden", value:'+ !projectObject.reactions.enable +', enabled: '+projectObject.reactions.enable+'}');
        var pnlRe = add('panel {text:"Lista de Reacciones",orientation:"row",alignChildren:["left","fill"], enabled:false}');
        var btnsReact , list ;
        with(pnlRe){
            
            var listOrder = [];
            
            list = add ("listbox",undefined);        
            for (var i = 0; i < projectObject.reactions.list.length; i++)
             {
                list.add ("item", projectObject.reactions.list[i]);
             }
            
            btnsReact = add('group {orientation:"column"}')
            var up = btnsReact.add ("button", undefined, "Subir");
            var down = btnsReact.add ("button", undefined, "Bajar");
            
            up.onClick = function (){
                var n = list.selection.index;
                if (n > 0){
                    swap (list.items [n-1], list.items [n]);
                    list.selection = n-1;
                }
             }
            down.onClick = function (){
                 var n = list.selection.index;
                 if (n < list.items.length-1){
                    swap (list.items [n], list.items [n+1]);
                    list.selection = n+1;
                 }
             }
            function swap (x, y){
                var temp = x.text;
                x.text = y.text;
                y.text = temp;
                addReactionImages();
             }
         
            function addReactionImages(){
                for (var i = 0; i < projectObject.reactions.list.length; i++)
                 {
                 list.items[i].image = File (coreFolder +"images/"+list.items[i].text+ '.png');
                 listOrder[i] = list.items[i].text;
                 }
                projectObject.reactions.list = listOrder;
            }
        
            addReactionImages();
        }
        with(chkRe){
            addEventListener('click', (function(){return function(){
                if(value == true){
                    pnlRe.enabled = true;
                    list.selection = 0;
                }else{
                    pnlRe.enabled = false;
                }
             }})())
        }    
    }
    
    //w.tabs[0].add ('checkbox {text: "Show Start workspace when no documents are open"}');
    //w.tabs[0].add ('checkbox {text: "Show Recent Files workspace when opening a file"}');
    
    w.buttons = w.add ('group {alignment: "right"}');
    w.buttons.add ('button {text: "Ejecutar"}');
    w.buttons.add ('button {text: "Cancelar"}');
    
    for(var i = 0; i < w.buttons.children.length; i++){
        w.buttons.children[i].onClick = (function(i){return function(){  
            if(w.buttons.children[i].text == "Cancelar"){
                closeWindow();
            }else{
                validateProject ();
            }
        }})(i)
    }
    
    
    for (var i = 0; i < w.tabs.length; i++) {
        w.tabs[i].orientation = 'column';
        w.tabs[i].alignChildren = 'fill';
        w.tabs[i].alignment = ['fill','fill'];
        w.tabs[i].visible = false;
    }
    w.stubs.onChange = showTab;
    
    function radioEnabled(index){
        var r_enabled = true;
        
        if(projectObject.type == "versus" && (index == 0 || index == 2)){
            r_enabled = false;
        }
        if((projectObject.type == "image" || projectObject.type == "meme") && index != 0){
            r_enabled = false;
        }
    
        if(imageData.length != 0){
            if(i == (imageData.length -1)  || i > (imageData.length -1) ){
                    r_enabled = true;
            }else{
                r_enabled = false;
            }
        }
        
        return r_enabled;
    }

    function radioValue(index){
        var r_value = false;
        
        if((projectObject.type == "image" || projectObject.type == "meme") && index == 0){
            r_value = true;
        }else if((imageData.length - 1) == i ){
            r_value = true;
        }        
        return r_value;
    }
    
    function showTab () {
        if (w.stubs.selection !== null) {
            for (var i = w.tabs.length-1; i >= 0; i--) {
                w.tabs[i].visible = false;
            }
            w.tabs[w.stubs.selection.index].visible = true;
        }
    }

    function getFileName(index){
        if(projectObject.files[index] == undefined){
            return "Selecciona una imagen";
        }else{
            return projectObject.files[index].toString();
        }
    }

    function addFileData(index,txtBox){
        var file = File.openDialog ("Selecciona una imagen" , undefined, false );
        if(file == null) 
            return;
        var sourceDoc = app.open(file);
        
        var oname = sourceDoc.name;
        
        var d = new Date();
        var dValue = d.getHours()+"_"+d.getMinutes()+"_"+d.getSeconds();

         var ext = '.png';
		var newName = "";
		var dot = oname.lastIndexOf('.');
         newName += projectObject.ProjectName;
         newName += "-"+dValue+"__";
		newName += oname.substring(0, dot);
//		newName += ext;

        savetempPNG(true,false, (newName + ext));
         
        if(projectObject.type == "image"){
            var defaultRulerUnits = app.preferences.rulerUnits;  
            app.preferences.rulerUnits = Units.PIXELS;
              $.writeln('width:'+sourceDoc.width,'height:'+sourceDoc.height);
              projectObject.imageSize = [parseInt(sourceDoc.width),parseInt(sourceDoc.height)];
              
              if(parseInt(sourceDoc.width) >= parseInt(sourceDoc.height)){
                  projectObject.imageType = "Normal";
              }else{
                  projectObject.imageType = "Vertical";
              }
            app.preferences.rulerUnits = defaultRulerUnits;
        }                  
         createThumb(sourceDoc,newName);         
         closeDocument();
         
         var nf = new File(projectFolder+"/images/" + newName + "-thumb.png");
         
        imgPnl[index].imagePreview.onDraw = (function(nf){
            return function(){
                this.graphics.drawImage(ScriptUI.newImage(nf), 0,0);  
                //delete this.onDraw;
            }
        })(nf); 
    
         imageData[index] = newName + ext;
         thumbsData[index] = newName + "-thumb.png";
         
         txtBox.text = oname + " - (" + newName  + ".png)";
    
         imgPnl[index].imagePreview.isseted =  true;
         projectObject.files = imageData;
         
         generateProject_file(projectObject.ProjectName,projectObject);
         
         alert("Imagen agregada correctamente al proyecto");
    }

    function deleteData(index){
        if(imgPnl[index].imagePreview.isseted == false)
            return;

        imageData[index] = null;
        var nf = new File(coreFolder+"images/core_holder.png")
        formPanel[index].textBox.text = "Selecciona una imagen";         
        imgPnl[index].imagePreview.onDraw = (function(nf){
        return function(){
            this.graphics.drawImage(ScriptUI.newImage(nf), 0,0, 75,75);  
            //delete this.onDraw;
        }
        })(nf); 

        projectObject.files = imageData;
        generateProject_file(projectObject.ProjectName,projectObject);
        imgPnl[index].imagePreview.isseted = false;
        alert('Imagen eliminada')
    }

    function updateFileSelectors(max){
        for(var i = 0; i < 4; i++){
            if(i < max){
                w.tabs[0][1].children[i].enabled = true;
            }else{
                w.tabs[0][1].children[i].enabled = false;
                if(imageData.length != 0){
                    deleteData(i)
                }
            }
            if(projectObject.type == "versus" && i == 2){
                radiosSelect[2].enabled = false;
            }        
        
        }
    }

    function verifyCheck(dom){
        if(dom == undefined){
            for(var i = 0; i < radiosSelect; i++){
                if(radiosSelect[i].value == true){
                    projectObject.fileNumber = radiosSelect[i].text;
                }
            }
        }else{
            projectObject.fileNumber = dom.text;
        }

        updateFileSelectors(projectObject.fileNumber);
        generateProject_file(projectObject.ProjectName,projectObject);    
    }

    function colorpicker (result_color) {
        var hexToRGB = function(hex) {
          var r = hex >> 16;var g = hex >> 8 & 0xFF;var b = hex & 0xFF;
          return [r, g, b];    
        };
     
        try{
            var cp = app.showColorPicker();
            var foregroundColor = app.foregroundColor; 
            var red = foregroundColor.rgb.red / 255;
            var green= foregroundColor.rgb.green / 255;
            var blue = foregroundColor.rgb.blue / 255;
            return [red,green,blue,1];
        }catch(_){
            var color_decimal = $.colorPicker();
            //$.writeln(color_decimal);
            var color_hexadecimal = color_decimal.toString(16);
            //$.writeln(color_hexadecimal);
            var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
            //$.writeln(color_rgb);
            var result_color = [color_rgb[0] / 255, color_rgb[1] / 255, color_rgb[2] / 255, 1];
            //$.writeln(result_color); 
            return result_color;        
            return color_rgb;
        }
    }
 
    function customDraw() {
        with( this ) {
            graphics.drawOSControl();
            graphics.rectPath(0,0,size[0],size[1]);
            graphics.fillPath(fillBrush);
            if( text ) graphics.drawString(text,textPen,(size[0]-graphics.measureString (text,graphics.font,size[0])[0])/2,3,graphics.font);
        }
    }


    function validateProject(){
        
        var status = true;
        //verify images
        if(projectObject.fileNumber != imageData.length){
            alert('Hay menos imagenes de las seleccionadas para trabajar');
            w.stubs.selection = 0;
            status = false;
        }else{
            for(var i = 0; i < imageData.length; i++){
                if(imageData[i] == null || imageData[i] == undefined){ 
                    alert('Hay menos imagenes de las seleccionadas para trabajar');
                    w.stubs.selection = 0;
                    status = false;
                    break;
                 }
            }
        }
    
        w.stubs.selection = 1;
         //verify TextBoxes
         if(textPnl[0][1].tagCustom.text != "" && textPnl[0][1].visible != false){
             $.writeln('custom tag',textPnl[0][1].tagCustom);
             projectObject.text.tag.enable = true;
             projectObject.text.tag.text = textPnl[0][1].tagCustom.text;
         }else{
             if(textPnl[0][0].visible == false){
                 projectObject.text.tag.enable = false;
             }else{                 
                 var indexTag = textPnl[0][0].Dropdown.selection.index;
                $.writeln('indexed tag', textPnl[0][0].Dropdown.selection,indexTag);

                 projectObject.text.tag.index = indexTag;
                 projectObject.text.tag.enable = true;
             }           
         }
     
         if(textPnl[1][0].textBox.text != "" && textPnl[1][0].visible != false){
             projectObject.text.top.enable = true;
             projectObject.text.top.text = textPnl[1][0].textBox.text;
         }else{
             projectObject.text.top.enable = false;
         }
     
         if(textPnl[2][0].textBox.text != "" && textPnl[2][0].visible != false){
             projectObject.text.bottom.enable = true;
             projectObject.text.bottom.text = textPnl[2][0].textBox.text;
         }else{
             projectObject.text.bottom.enable = false;
         }
     
         if(textPnl[3][0].textBox.text != "" && projectObject.text.description.enable != false){
             projectObject.text.description.enable = true;
             projectObject.text.description.text = textPnl[3][0].textBox.text;
         }else{
             projectObject.text.description.enable = false;
         }
        
        if(status){
            generateProject_file(projectObject.ProjectName,projectObject);
            closeWindow ();
            for(var i = 0; i < window.length; i++){
                try{
                    window[i].close();
                }catch(_){
                    //$.writeln ('Esta ventana ya fue cerrada');
                }
            }
            executeProject();
         }
    
    }
    
    
    w.onShow = function () {
        w.stubs.selection = 0;
        showTab;
        w.location.y = 50;
    }   
    
    if(imageData.length != 0){
        verifyCheck();
    }    
    prevWindow  = openWindow;
    openWindow  = w;
    w.show();
}

function changeOpacity(layer,fill){
    selectLayer(true,false,layer);
    var opacityTochange = app.activeDocument.activeLayer;
    
    window[0] = new Window ('dialog {text: "AG Generator - Opacidad", alignChildren: ["fill","fill"], winID: 1}');
    var w = window[0];
    
    var x = 0;
    var current = parseInt(opacityTochange.opacity);
    //var current = 10;
    w.radios = w.add ('group {alignChildren: ["fill","fill"]}');
    var radiosSelect = [];
    with(w.radios){
        for(var i = 0; i < 11; i++){
            radiosSelect[i] = add('radiobutton {text: '+(x)+'}');
            radiosSelect[i].value = (x == current);
            radiosSelect[i].opacityValue = x;
            children[i].addEventListener('click', function(event){verifyOpacity(this)});    
            x += 10;            
        }
    }

    function verifyOpacity(Dom){
        var opacityValue = parseInt(Dom.opacityValue);
        //alert(opacityValue);
        addOpacity(true,false,opacityValue);
        app.refresh();
    }


    w.finalEdit = w.add ('group {alignChildren: ["fill","fill"]}');
    w.finalEdit.add ('button {text: "Aceptar"}');
    
    w.finalEdit.children[0].onClick = (function(i){return function(){
            w.close();
    }})()    
    
    
    w.onShow = function () { 
        w.location.x = 15;
    }
    
    w.show();    
    
}

function fontChangerScreen(layer, name){    
    selectLayer(true,false,layer);
    var textTochange = app.activeDocument.activeLayer; 
    
    window[0] = new Window ('dialog {text: "AG Generator - Fuente '+name+'", alignChildren: ["fill","fill"], winID: 1}');

    var w = window[0];
    
    
    var e = w.add ("edittext", undefined, parseInt(textTochange.textItem.size));
    var slider = w.add ("slider", undefined, parseInt(textTochange.textItem.size), 5, 200);
    slider.enabled = false;
    
    w.buttons = w.add ('group {alignChildren: ["fill","fill"]}');
    w.buttons.add ('button {text: "< Disminuir - 5"}');
    w.buttons.add ('button {text: "Aumentar + 5 >"}'); 

    for(var i = 0; i < w.buttons.children.length; i++){
        w.buttons.children[i].onClick = (function(i){return function(){  
            if(w.buttons.children[i].text == "< Disminuir - 5"){
                slider.value -= 5;
            }else{
                slider.value += 5;
            }
            e.text = slider.value;
            changeTextSize(true,false,parseInt (slider.value));
            app.refresh();
        }})(i)
    }
    

    w.finalEdit = w.add ('group {alignChildren: ["fill","fill"]}');
    w.finalEdit.add ('button {text: "Aceptar"}');
    
    w.finalEdit.children[0].onClick = (function(i){return function(){
            w.close();
    }})()

    openWindow  = w;
    
    w.onShow = function () { 
        w.location.x = 15;
    }
    
    w.show();
    
}

function executeProject(){    
    switch(projectObject.type){
        case "versus":
            $.evalFile (versus);
            VersusImage();
            break;
        case "image":
            $.evalFile (image);
            $.writeln("executed: ",projectObject.type);    
            NormalImage();            
            break;
        case "meme":
            $.evalFile (meme);
            MemeImage();
    }
    app.refresh();
    alert('La Creación ha terminado con éxito!');
}

function preferenciasWindow(){
    alert('Las preferencias en este momento no estan disponibles :D');
}