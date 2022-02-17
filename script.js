//list of all family
const MOTHER = {name:"mother", sex:"XX", genotype:"none", relationship:"mother", matphase:"none", patphase:"none", side:"maternal"};
const FATHER = {name:"father", sex:"XY", genotype:"none", relationship:"father", matphase:"none", patphase:"none", side:"paternal"};
const MATREF = {name:"referenceM", sex:"none", genotype:"none", relationship:"none", matphase:"none", patphase:"none", side:"maternal"};
const PATREF = {name:"referenceP", sex:"none", genotype:"none", relationship:"none", matphase:"none", patphase:"none", side:"paternal"};
let INHERITANCE = "autosomal_dominant"
let FAMILY = [MOTHER,FATHER,MATREF,PATREF];
let REFERENCE = "none";
let parental_phase;

//list default family names
var default_names = [
    "Female PARTNER", 
    "Male PARTNER",
    "Sibling",
    "Maternal GRANDMOTHER",
    "Maternal GRANDFATHER",
    "Paternal GRANDMOTHER",
    "Paternal GRANDFATHER"];

//fill family names with default names to begin with
let family_names = [];
function fill_default_names(){
    for(i=0;i<default_names.length;i++){
        family_names.push(default_names[i]);
    } 
}
fill_default_names();

function update_names(){
    //list of variables for names (postions match default family names)
    let family = [
        "mother_name",
        "father_name",
        "sibling_name",
        "matGM_name",
        "matGF_name",
        "patGM_name",
        "patGF_name"
    ];
    for(i=0;i<family.length;i++){
        if (document.getElementById(CSS.escape(family[i])).value != ""){
            family_names[i] = document.getElementById(CSS.escape(family[i])).value;
        }
        else{
            family_names[i] = default_names[i];
        }
    }
}

function reset_reference(){//to restore reference back to defaults of none
    document.getElementById("noneM").checked = true;
    document.getElementById("noneP").checked = true;
    MATREF = {name:"referenceM", sex:"none", genotype:"none", relationship:"none", matphase:"none", patphase:"none", side:"maternal"};
    PATREF = {name:"referenceP", sex:"none", genotype:"none", relationship:"none", matphase:"none", patphase:"none", side:"paternal"};
}

function populate_people(){
    for(j=0;j<FAMILY.length;j++){
        if(INHERITANCE == "autosomal_recessive" && PATREF.relationship == "sibling"){
            return;
        }
        else if (FAMILY[j].name == "mother" || FAMILY[j].name == "father"){
            //nothing for now may add genotype later
        }
        else{
            person_name = FAMILY[j].name;
            let insert_relationship = document.querySelector('input[name=' + CSS.escape(person_name) + ']:checked').value;
            FAMILY[j].relationship = insert_relationship;
            if (insert_relationship == "grandmother" || insert_relationship == "female_sibling"){
                FAMILY[j].sex = "XX";
            }
            else if (insert_relationship == "grandfather" || insert_relationship == "male_sibling"){
                FAMILY[j].sex = "XY";
            }
            else if (insert_relationship == "sibling"){
                FAMILY[j].sex = "unknown";
            }
            else if (insert_relationship == "none"){
                FAMILY[j].sex = "none";
            } 
            else{
                return error_message ("unknown relationship added");
            }
            if (FAMILY[j].relationship == "female_sibling" || FAMILY[j].relationship == "male_sibling"){
                FAMILY[j].relationship = "sibling";
            }
        }               
    }
} 

//function to load inheritance type as global element and fill drop down lists
function inheritance(){
    
    INHERITANCE = document.querySelector('input[name="Inheritance"]:checked').value;
    //dealing with possible same sibling as both refs
    let sibling_sex = document.querySelector('input[name="sibling_sex"]:checked').value; 
    let sibling_ref = document.querySelector('input[name="sibling_ref"]:checked').value;
          
    if (INHERITANCE == "autosomal_recessive" && sibling_ref == "sibling_yes"){
        MATREF.sex = PATREF.sex = sibling_sex;
        MATREF.relationship = "sibling";
        PATREF.relationship = "sibling";
        DROPDOWN(referenceM,sibling_sex);
        DROPDOWN(referenceP,sibling_sex);  
    }
    //reset the refs if not using sibling with autosomal recessive case
    else{
        PATREF.sex = MATREF.sex = "none";
        PATREF.relationship = MATREF.relationship = "none";
    }
      
    //every other scenario
    for (let i=0; i<FAMILY.length; i++){
        let A = document.getElementById(FAMILY[i].name);
        let sex = FAMILY[i].sex;
        DROPDOWN(A, sex);
        populate_people();
        }
}

//Lists to display for different inheritance types depending on gender differnt genders
let D = [
    "Unaffected",
    "Affected"
];

let AR = [
    "Unaffected",
    "Carrier",
    "Affected"
];

let XRM = [
    "Unaffected",
    "Hemizygous mutant"
];

let EMPTY = [
    "No reference"
];

let GENDER_NEEDED = [
    "Gender required for reference"
];

let REC_SIB = [
    "Unaffected",
    "Carrier Paternal",
    "Carrier Maternal",
    "Affected"
];
//function for generating drop down menus
function DROPDOWN(form, sex){    
    //clear current elments if new ditions are chosen 
    let selectlist = form.querySelector('select[name="dropdown"]');
    L = selectlist.options.length;
    for(var j = 0; j < L; j++) {
        selectlist.remove(L-1-j);
    }
    //Check inheritance type and sex to load correct list of options 
    let list =[];
    if (sex == "none"){
        list = EMPTY;
    }
    else if (INHERITANCE == "autosomal_dominant" || INHERITANCE == "Xlinked_dominant")
    {
        list = D;
    }  
    else if ((INHERITANCE == "autosomal_recessive" && MATREF.relationship != "sibling" )||(INHERITANCE == "Xlinked_recessive" && sex == "XX"))
    {
        list = AR;
    }
    else if (INHERITANCE == "Xlinked_recessive" && sex == "XY")
    {
        list = XRM;
    }
    else if (INHERITANCE == "Xlinked_recessive" && sex == "unknown")
    {
        list = GENDER_NEEDED;
    }
    else if (INHERITANCE == "autosomal_recessive" && MATREF.relationship == "sibling"){
        list = REC_SIB;
    }
    
    //Add all options to list
    for (i=0; i<list.length; i++)
    {
        var option = document.createElement("option");
        option.text = list[i];
        option.value = list[i];
        var select = form.querySelector('select[name="dropdown"]');
        select.appendChild(option);  
    }
}

function insert_genotypes(){
    for(i=0;i<FAMILY.length;i++){
        let formid = document.getElementById(FAMILY[i].name);
        let selectlist = formid.querySelector('select[name="dropdown"]');
        let value = selectlist.options[selectlist.selectedIndex].text;
        if (INHERITANCE == "autosomal_recessive" && MATREF.relationship == "sibling"){
            if (FAMILY[i].name == "referenceM"){
                if (value == "Carrier Paternal" || value == "Unaffected"){
                    value = "Unaffected";
                }
                else if (value == "Carrier Maternal" || value == "Affected"){
                    value = "Affected";
                }
            }
            else if (FAMILY[i].name == "referenceP"){
                formid = document.getElementById(FAMILY[i-1].name);
                selectlist = formid.querySelector('select[name="dropdown"]');
                value = selectlist.options[selectlist.selectedIndex].text;
                if (value == "Carrier Paternal" || value == "Affected"){
                    value = "Affected";
                }
                else if (value == "Carrier Maternal" || value == "Unaffected"){
                    value = "Unaffected"
                }
            }
        }
        if (value == "No reference"){
            value = "none";
        }
        FAMILY[i].genotype = value;
    } 
}

function reference(){
    let pat = FAMILY.find(o => o.name === "referenceP");
    pat = pat.genotype;
    let mat = FAMILY.find(o => o.name === "referenceM");
    mat = mat.genotype;
    if (mat == "none" && pat == "none"){
        REFERENCE = "none";
    }
    else if (mat == "none"){
        REFERENCE = "paternal";
    }
    else if (pat == "none"){
        REFERENCE = "maternal";
    }
    else{
        REFERENCE = "both";
    }
}

function insert_phase(){
    //clear any old phases
    for(i=0;i<FAMILY.length;i++){
        FAMILY[i].matphase = "none";
        FAMILY[i].patphase = "none";
    }
    let ref;
    //autosomal dominant & X-linked dominant & X-linked recessive
    if (INHERITANCE != "autosomal_recessive"){
        if (REFERENCE == "paternal"){
            PATREF.patphase = "P1";
            MATREF.matphase = "none";
            ref = FAMILY.find(o => o.name === "referenceP");
            ref = ref.genotype;
        }
        else if (REFERENCE == "maternal"){
            PATREF.patphase = "none";
            MATREF.matphase = "M1";
            ref = FAMILY.find(o => o.name === "referenceM");
            ref = ref.genotype;
        }
        else {
            PATREF.patphase = "none";
            MATREF.matphase = "none";
            return error_message("Needs exactly 1 reference");
        }
        for(i=0;i<FAMILY.length;i++){
            let A = FAMILY[i].genotype;
            if (A == "Carrier" || A == "Hemizygous mutant" || A == "Affected"){
                A = "Affected";
            }
            else{
                A = "Unaffected";
            }
            if (ref == "Carrier" || ref == "Hemizygous mutant" || ref == "Affected"){
                ref = "Affected";
            }
            if (FAMILY[i].side == REFERENCE && A == ref){
                if (REFERENCE == "maternal"){
                    FAMILY[i].matphase = "M1";
                }
                else{
                    FAMILY[i].patphase = "P1";
                }
            }
            else if (FAMILY[i].side == REFERENCE && A != ref){
                if (REFERENCE == "maternal"){
                    FAMILY[i].matphase = "M2";
                }
                else{
                    FAMILY[i].patphase = "P2";
                }
            }              
        }          
    }
    //autosomal recessive
    else{
        if (REFERENCE != "both"){
            return error_message("Must have both a maternal and paternal reference");
        }
        else{
            PATREF.patphase = "P1";
            MATREF.matphase = "M1";
            let refP = FAMILY.find(o => o.name === "referenceP");
            if (refP.genotype == "Affected" || refP.genotype == "Carrier"){
                refP = "Affected";
            }
            else{
                refP = "Unaffected";
            }
            let refM = FAMILY.find(o => o.name === "referenceM");
            if (refM.genotype == "Affected" || refM.genotype == "Carrier"){
                refM = "Affected";
            }
            else{
                refM = "Unaffected";
            }
            
            for(i=0;i<FAMILY.length;i++){
                let A = FAMILY[i].genotype;
                if (A == "Affected" || A == "Carrier"){
                    A = "Affected";
                }
                if (FAMILY[i].side == "paternal"){
                    if (A == refP){
                        FAMILY[i].patphase = "P1";
                    }
                    else{
                        FAMILY[i].patphase = "P2";
                    }
                }
                else if (FAMILY[i].side == "maternal"){
                    if (A == refM){
                        FAMILY[i].matphase = "M1";
                    }
                    else{
                        FAMILY[i].matphase = "M2";
                    }
                }
            
            }              
        } 
    } 
}

function error_message(message){
    document.getElementById("error_message").innerHTML = message;
}

function generate_pedigree(){
    document.getElementById("canvas").style.display = "block";
    document.getElementById("download").style.display = "block";
    error_message("");
    insert_genotypes();
    reference();
    insert_phase();
    count_family();
}

//CANVAS
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

//function to generate node on pedigree
function person(x,y,sex,patphase,matphase,name){
    let left = c.fillStyle = "White";
    let right = c.fillStyle = "White";
    //basic format of nodes
    c.lineWidth = 8;
    c.strokeStyle = "Indigo";
    c.lineJoin = "round";
    //Text
    c.textAlign = "center";
    c.font = "16px Arial";
    c.fillStyle = "Indigo";
    c.fillText(name, x, y+80);
    left; //fill style
    //check mat and pat phase to asign colours
    if(patphase == "P1"){
        left = c.fillStyle = "RoyalBlue";
    }
    else if (patphase == "P2"){
        left = c.fillStyle = "Red";
    }
    else if (patphase == "none"){
        if (matphase == "M1"){
            left = c.fillStyle = "Orange";
        }
        else if (matphase == "M2"){
            left = c.fillStyle = "#29a329";
        }
        else if(matphase == "none"){
        }
        else{
            return error_message("maternal phase invalid");
        }
    }
    else{
        return error_message("paternal phase invalid");
    }
    if(patphase == "P1" || patphase == "P2"){
        if(matphase == "M1"){
            right = c.fillStyle = "Orange";
        }
        else if (matphase == "M2"){
            right = c.fillStyle = "#29a329";
        }
        else if (matphase == "none"){
        }
        else{
            return error_message("maternal phase invalid");
        }
    }
    //check for none carrier genotypes and colour according to phase
    if(INHERITANCE == "autosomal_dominant" || INHERITANCE == "Xlinked_dominant" || (INHERITANCE == "Xlinked_recessive" && sex == "XY") ||(left =="White" && right =="White")){
        c.fillStyle = left; //fill colour
        //check for gender to assign correct shape
        if(sex == "XX"){
            c.beginPath();
            c.arc(x, y, 40, 0, Math.PI * 2, false);
            c.fill();
            c.stroke();
        }
        else if(sex == "XY"){
            c.beginPath();
            c.rect(x-40, y-40, 80, 80);
            c.fill();
            c.stroke(); 
        }
        else if(sex == "unknown"){
            c.save(); //save current state of canvas
            c.translate(x,y); //set centre of canvas to object
            c.rotate(45 * Math.PI / 180); //rotate canvas
            c.translate(-x,-y); //reset centre of canvas
            //draw object
            c.beginPath();
            c.rect(x-40, y-40, 80, 80);
            c.fill();
            c.stroke();
            c.restore(); //restore canvas
        }
        else{
            return error_message("invalid gender");
        } 
    }
    //Check for carrier genotype and assign code to colour 2 sides of node
    else{
        //check for gender
        if(sex == "XX"){
            c.fillStyle = left;
            c.beginPath();
            c.arc(x, y, 40, Math.PI*1.5, Math.PI*0.5, true);
            c.fill();
            c.stroke();
            c.fillStyle = right;
            c.beginPath();
            c.arc(x, y, 40, Math.PI*1.5, Math.PI*0.5, false);
            c.lineTo(x, y-40);
            c.fill();
            c.stroke();
        }
        else if(sex == "XY"){
            c.beginPath();
            c.rect(x - 40, y - 40, 40, 80);
            c.fillStyle = left;
            c.fill();
            c.stroke();
            c.beginPath();
            c.rect(x, y - 40, 40, 80);
            c.fillStyle = right;
            c.fill();
            c.stroke();
        }
        else if (sex == "unknown"){
            c.fillStyle = left;
            c.save(); //save current state of canvas
            c.translate(x,y); //set centre of canvas to object
            c.rotate(-45 * Math.PI / 180); //rotate canvas
            c.translate(-x,-y); //reset centre of canvas
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(x-40, y+40);
            c.lineTo(x-40, y-40);
            c.lineTo(x+40, y-40);
            c.lineTo(x, y);
            c.fill();
            c.stroke();
            c.fillStyle = right;
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(x+40, y-40);
            c.lineTo(x+40, y+40);
            c.lineTo(x-40, y+40);
            c.lineTo(x, y);
            c.fill();
            c.stroke();
            c.restore();
        }
    }
}

function line(a,b,x,y){//start xy and end xy
    c.lineWidth = "8";
    c.strokeStyle = "Indigo";
    c.beginPath();
    c.moveTo(a, b);
    c.lineTo(x, y);
    c.stroke(); 
}

function count_family(){
    //count different family members
    let mat_grandparent = 0;
    let pat_grandparent = 0;
    let sibling = 0;
    for(i=0;i<FAMILY.length;i++){
        let person = FAMILY[i].relationship;
        let side = FAMILY[i].side;
        if ((person == "grandmother" || person == "grandfather") && side == "maternal"){
            mat_grandparent++;
        }
        else if ((person == "grandmother" || person == "grandfather") && side == "paternal"){
            pat_grandparent++;
        }
        //checking for the reference sibling only to make sure only counted once
        else if (FAMILY[i].name == "referenceM" || FAMILY[i].name == "referenceP" && person == "sibling"){
            sibling = 1;
        }   
    }
    build_pedigree(mat_grandparent,pat_grandparent,sibling);   
}

function build_pedigree(mat_grandparent,pat_grandparent,sibling){
    //clear canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    //position of top left person in pedigree
    let x = 100; 
    let y = 160;
    let a = 0; //extra for couple x
    let b = 0; //extra for couple y
    let a2 = 0; //extra for sparating couple when grandparents are there
    let x2 = 0;//extra x for mat grandparents if needed
    let matref;
    let patref;
    let sex;

    //title
    c.font = "40px Arial";
    c.fillStyle = "Indigo";
    c.textAlign = "left";
    c.fillText("Pedigree", x-50, y-90);
    
    //sibling(s) only
    if (mat_grandparent == 0 && pat_grandparent == 0 & sibling > 0){
        line(x + 125,y,x +125,y+200);//line couple to sibling
        if(MATREF.relationship == "sibling" || PATREF.relationship == "sibling"){ //only for reference sibling
            if (MATREF.relationship == "sibling"){
                matref = MATREF.matphase;
                sex = MATREF.sex;
            }
            else{
                matref = "none";
            }
            if (PATREF.relationship == "sibling"){
                patref = PATREF.patphase;
                sex = PATREF.sex;
            }
            else{
                patref = "none";
            }
            person(x + a + 125, y + 200,sex,patref,matref,family_names[2]);
        }
    }
    //grandparents
    if(mat_grandparent>0 || pat_grandparent>0){
        b = 200;
        if (pat_grandparent > 0){
            //Add co-ord additions to place couple
            a = 125;
            //Add line for pedigree
            line(x,y,x+250,y); //line between grandparents
            line(x+125,y,x+125,y+200); //line to father
            if (pat_grandparent == 1){
                for(i=0;i<FAMILY.length;i++){
                    if(FAMILY[i].relationship == "grandfather" && FAMILY[i].side == "paternal"){
                        person(x,y,FAMILY[i].sex,FAMILY[i].patphase,FAMILY[i].matphase,family_names[6]);//pat gf
                        person(x + 250,y,"XX","none","none",family_names[5]);//pat gm no details
                    }
                    else if (FAMILY[i].relationship == "grandmother" && FAMILY[i].side == "paternal"){
                        person(x,y,"XY","none","none",family_names[6]);//pat gf no details
                        person(x + 250,y,FAMILY[i].sex,FAMILY[i].patphase,FAMILY[i].matphase,family_names[5]);//pat gm 
                    }
                }
            }
            else if(pat_grandparent == 2){
                for(i=0;i<FAMILY.length;i++){
                    if(FAMILY[i].relationship == "grandfather" && FAMILY[i].side == "paternal"){
                        person(x,y,FAMILY[i].sex,FAMILY[i].patphase,FAMILY[i].matphase,family_names[6]);//pat gf
                    }
                    if (FAMILY[i].relationship == "grandmother" && FAMILY[i].side == "paternal"){
                        person(x + 250,y,FAMILY[i].sex,FAMILY[i].patphase,FAMILY[i].matphase,family_names[5]);//pat gm 
                    }
                }
            } 
        }
        if(mat_grandparent>0){
            if(pat_grandparent == 0){
                a=0;
            }
            else if (pat_grandparent>0){
                x2 = 375;
                a=125;
                a2=250;
            }
            line(x+125+x2,y,x+375+x2,y); //line between grandparents
            line(x+250+x2,y,x+250+x2,y+200); //line to mother
            if (mat_grandparent == 1){
                for(i=0;i<FAMILY.length;i++){
                    if(FAMILY[i].relationship == "grandfather" && FAMILY[i].side == "maternal"){
                        person(x  +x2 +125,y,FAMILY[i].sex,FAMILY[i].patphase,FAMILY[i].matphase,family_names[4]);//mat gf
                        person(x +x2 + 375,y,"XX","none","none",family_names[3]);//mat gm no details
                    }
                    else if (FAMILY[i].relationship == "grandmother" && FAMILY[i].side == "maternal"){
                        person(x +x2 +125,y,"XY","none","none",family_names[4]);//mat gf no details
                        person(x +x2 +375,y,FAMILY[i].sex,FAMILY[i].patphase,FAMILY[i].matphase,family_names[3]);//mat gm 
                    }
                }
            }
            else if(pat_grandparent == 2){
                for(i=0;i<FAMILY.length;i++){
                    if(FAMILY[i].relationship == "grandfather" && FAMILY[i].side == "maternal"){
                        person(x +x2 +125,y,FAMILY[i].sex,FAMILY[i].patphase,FAMILY[i].matphase,family_names[4]);//mat gf
                    }
                    if (FAMILY[i].relationship == "grandmother" && FAMILY[i].side == "maternal"){
                        person(x + x2 +375,y,FAMILY[i].sex,FAMILY[i].patphase,FAMILY[i].matphase,family_names[3]);//mat gm  
                    }
                }
            } 
        }
    }
    //couple + joining line (will be present in every pedigree)
    line(x + a, y + b, x + a + a2 + 250, y + b);
    
    let father = FAMILY.find(o => o.name === "father");
    person(x + a, y + b,father.sex,father.patphase,father.matphase,family_names[1]);
    
    let mother = FAMILY.find(o => o.name === "mother");
    person(x + a + a2 + 250, y + b,mother.sex,mother.patphase,mother.matphase,family_names[0]);
 
    embryo_predictions(630);
    legend(40, 850);
}

function embryo_predictions(y){
    let affected;
    let unaffected;
    let mataffected;
    let matunaffected;
    //titles
    c.font = "40px Arial";
    c.fillStyle = "Indigo";
    c.textAlign = "left";
    c.fillText("Embryo Predictions", 50, y-110);

    if (INHERITANCE == "autosomal_dominant" || INHERITANCE == "Xlinked_dominant"){
        if (MATREF.genotype == "none"){
            if (PATREF.genotype == "Affected"){
                affected = "P1";
                unaffected = "P2";
            }
            else{
                affected = "P2";
                unaffected = "P1";
            }
            person(100,y,"unknown",unaffected,"none","Unaffected");
            person(350,y,"unknown",affected,"none","Affected");
        }
        else if (PATREF.genotype == "none"){
            if (MATREF.genotype == "Affected"){
                affected = "M1";
                unaffected = "M2";
            }
            else{
                affected = "M2";
                unaffected = "M1";
            }
            person(100,y,"unknown","none",unaffected,"Unaffected");
            person(350,y,"unknown","none",affected,"Affected");
        }
        else{
            return error_message("Error 1");
        }
    }
    else if (INHERITANCE == "Xlinked_recessive"){
        if (MATREF.genotype == "none"){
            if (PATREF.genotype == "Unaffected"){
                unaffected = "P1";
                affected = "P2";
            }
            else{
                unaffected = "P2";
                affected = "P1";
            }
            person(100,y,"XX",unaffected,"none","Unaffected Female");
            person(350,y,"XY",unaffected,"none","Unaffected Male");
            person(600,y,"XX",affected,"none","Carrier Female");
            person(850,y,"XY",affected,"none","Affected Male");
        }
        else if (PATREF.genotype == "none"){
            if (MATREF.genotype == "Unaffected"){
                unaffected = "M1";
                affected = "M2";
            }
            else{
                unaffected = "M2";
                affected = "M1";
            }
            person(100,y,"XX","none",unaffected,"Unaffected Female");
            person(350,y,"XY","none",unaffected,"Unaffected Male");
            person(600,y,"XX","none",affected,"Carrier Female");
            person(850,y,"XY","none",affected,"Affected Male");
        }
        else{
            return error_message("Error 2");
        }
    }
    else if (INHERITANCE == "autosomal_recessive"){
        if (MATREF.genotype == "Unaffected"){
            matunaffected = "M1";
            mataffected = "M2";
        }
        else{
            matunaffected = "M2";
            mataffected = "M1";
        }
        if (PATREF.genotype == "Unaffected"){
            unaffected = "P1";
            affected = "P2";
        }
        else{
            unaffected = "P2";
            affected = "P1";
        }
        person(100,y,"unknown",unaffected,matunaffected,"Unaffected");
        person(350,y,"unknown",affected,matunaffected,"Carrier (paternal variant)");
        person(600,y,"unknown",unaffected,mataffected,"Carrier (maternal variant)");
        person(850,y,"unknown",affected,mataffected,"Affected");
    }
}

function legend(x, y){
    c.font = "40px Arial";
    c.fillStyle = "Indigo";
    c.textAlign = "left";
    c.fillText("Legend", x+10, y-50);
   
    c.lineWidth = 4;
    c.fillStyle = "Indigo";
    c.strokeStyle = "Indigo";
    c.textAlign = "left";
    c.font = "20px Arial";
     
    //genders
    c.beginPath();
    c.rect(x+10, y, 30, 30);
    c.fill();
    c.stroke(); 
    c.fillText("Male",  x+60, y+21);

    c.beginPath();
    c.arc(x+25, y +60, 15, 0, Math.PI * 2, false);
    c.fill();
    c.stroke();
    c.fillText("Female",  x+60, y+66);

    c.save(); //save current state of canvas
    c.translate( x+25,y+90); //set centre of canvas to object
    c.rotate(45 * Math.PI / 180); //rotate canvas
    c.translate(-(x+25),-(y+90)); //reset centre of canvas
    //draw object
    c.beginPath();
    c.rect( x+25, y+90, 30, 30);
    c.fill();
    c.stroke();
    c.restore(); //restore canvas
    c.fillText("Unknown",  x+60, y+110);
    c.fillText("gender",  x+60, y+130);

    if (INHERITANCE == "autosomal_dominant" || INHERITANCE == "Xlinked_dominant" || INHERITANCE == "Xlinked_recessive"){
        if(REFERENCE == "paternal"){
            c.fillStyle = "RoyalBlue";
            c.beginPath();
            c.rect(x+170, y, 30, 30);
            c.fill();
            c.stroke();
            c.fillStyle = "Red";
            c.beginPath();
            c.rect(x+170, y+45, 30, 30);
            c.fill();
            c.stroke();

            if (INHERITANCE == "Xlinked_recessive"){
                c.fillStyle = "RoyalBlue";
                c.beginPath();
                c.arc(x+185, y+105, 15, Math.PI*1.5, Math.PI*0.5, true);
                c.fill();
                c.stroke();
                c.fillStyle = "White";
                c.beginPath();
                c.arc(x+185, y+105, 15, Math.PI*1.5, Math.PI*0.5, false);
                c.lineTo(x+185,y+90);
                c.fill();
                c.stroke();

                c.fillStyle = "Red";
                c.beginPath();
                c.arc(x+185, y+150, 15, Math.PI*1.5, Math.PI*0.5, true);
                c.fill();
                c.stroke();
                c.fillStyle = "White";
                c.beginPath();
                c.arc(x+185, y+150, 15, Math.PI*1.5, Math.PI*0.5, false);
                c.lineTo(x+185,y+135);
                c.fill();
                c.stroke();
                
                if (PATREF.genotype == "Unaffected"){
                    c.fillStyle = "Indigo";
                    c.fillText("P1 - Unaffected Male", x+215, y+23);
                    c.fillText("P2 - Affected Male", x+215, y+68);
                    c.fillText("P1 - Unaffected Female", x+215, y+113);
                    c.fillText("P2 - Carrier Female", x+215, y+158);
                }
                else{
                    c.fillStyle = "Indigo";
                    c.fillText("P1 - Affected Male", x+215, y+23);
                    c.fillText("P2 - Unaffected Male", x+215, y+68);
                    c.fillText("P1 - Carrier Female", x+215, y+113);
                    c.fillText("P2 - Unaffected Female", x+215, y+158);
                }
            }
            else{           
                if(PATREF.genotype == "Unaffected"){
                c.fillStyle = "Indigo";
                c.fillText("P1 - Unaffected", x+215, y+23);
                c.fillText("P2 - Affected", x+215, y+68);
                }
                else if(PATREF.genotype == "Affected"){
                    c.fillStyle = "Indigo";
                    c.fillText("P1 - Affected", x+215, y+23);
                    c.fillText("P2 - Unaffected", x+215, y+68);
                }
                else{
                    error_message("Legend error 1");
                }
            }
        }
        else if(REFERENCE == "maternal"){
            c.fillStyle = "Orange";
            c.beginPath();
            c.rect(x+170, y, 30, 30);
            c.fill();
            c.stroke();        
            c.fillStyle = "#29a329";
            c.beginPath();
            c.rect(x+170, y+45, 30, 30);
            c.fill();
            c.stroke();

            if (INHERITANCE == "Xlinked_recessive"){
                c.fillStyle = "Orange";
                c.beginPath();
                c.arc(x+185, y+105, 15, Math.PI*1.5, Math.PI*0.5, true);
                c.fill();
                c.stroke();
                c.fillStyle = "White";
                c.beginPath();
                c.arc(x+185, y+105, 15, Math.PI*1.5, Math.PI*0.5, false);
                c.lineTo(x+185,y+90);
                c.fill();
                c.stroke();

                c.fillStyle = "#29a329";
                c.beginPath();
                c.arc(x+185, y+150, 15, Math.PI*1.5, Math.PI*0.5, true);
                c.fill();
                c.stroke();
                c.fillStyle = "White";
                c.beginPath();
                c.arc(x+185, y+150, 15, Math.PI*1.5, Math.PI*0.5, false);
                c.lineTo(x+185,y+135);
                c.fill();
                c.stroke();
                
                
                if (MATREF.genotype == "Unaffected"){
                    c.fillStyle = "Indigo";
                    c.fillText("M1 - Unaffected Male", x+215, y+23);
                    c.fillText("M2 - Affected Male", x+215, y+68);
                    c.fillText("M1 - Unaffected Female", x+215, y+113);
                    c.fillText("M2 - Carrier Female", x+215, y+158);
                }
                else{
                    c.fillStyle = "Indigo";
                    c.fillText("M1 - Affected Male", x+215, y+23);
                    c.fillText("M2 - Unaffected Male", x+215, y+68);
                    c.fillText("M1 - Carrier Female", x+215, y+113);
                    c.fillText("M2 - Unaffected Female", x+215, y+158);
                }
            }

            else{
                if(MATREF.genotype == "Unaffected"){
                    c.fillStyle = "Indigo";
                    c.fillText("M1 - Unaffected", x+215, y+23);
                    c.fillText("M2 - Affected", x+215, y+68);
                }
                else if(MATREF.genotype == "Affected"){
                    c.fillStyle = "Indigo";
                    c.fillText("M1 - Affected", x+215, y+23);
                    c.fillText("M2 - Unffected", x+215, y+68);
                }
                else{
                    error_message("Legend error 1");
                }
            }
        }
        else{
            error_message("Legend Error 3");
        }
    }
    else if (INHERITANCE == "autosomal_recessive"){
        c.fillStyle = "RoyalBlue";
        c.beginPath();
        c.rect(x+170, y, 15, 30);
        c.fill();
        c.stroke();
        c.rect(x+185, y, 15, 30);
        c.stroke();

        c.fillStyle = "Red";
        c.beginPath();
        c.rect(x+170, y+45, 15, 30);
        c.fill();
        c.stroke();
        c.rect(x+185, y+45, 15, 30);
        c.stroke();

        c.fillStyle = "Orange";
        c.beginPath();
        c.rect(x+170, y+90, 15, 30);
        c.fill();
        c.stroke();
        c.rect(x+185, y+90, 15, 30);
        c.stroke();

        c.fillStyle = "#29a329";
        c.beginPath();
        c.rect(x+170, y+135, 15, 30);
        c.fill();
        c.stroke();
        c.rect(x+185, y+135, 15, 30);
        c.stroke();

        if(PATREF.genotype == "Unaffected"){
            c.fillStyle = "Indigo";
            c.fillText("P1 - Unaffected paternal variant", x+215, y+23);
            c.fillText("P2 - Carrier paternal variant", x+215, y+68);
        }
        else{
            c.fillStyle = "Indigo";
            c.fillText("P1 - Carrier paternal variant", x+215, y+23);
            c.fillText("P2 - Unaffected paternal variant", x+215, y+68);
        }
        
        if(MATREF.genotype == "Unaffected"){
            c.fillStyle = "Indigo";
            c.fillText("M1 - Unaffected maternal variant", x+215, y+113);
            c.fillText("M2 - Carrier maternal variant", x+215, y+158);
        }
        else{
            c.fillStyle = "Indigo";
            c.fillText("M1 - Carrier maternal variant", x+215, y+113);
            c.fillText("M2 - Unaffected maternal variant", x+215, y+158);
        }
    }
    else if (INHERITANCE == "X-linked_recessive"){

    }
}

//hiding everything at the start
function hide_all(){
    document.getElementById("inheritance_div").style.display = "none"; //inheritance
    document.getElementById("which_parental").style.display = "none"; //pat or mat reference
    document.getElementById("sibling_as_ref").style.display = "none"; //sibling as reference question
    document.getElementById("sibling_sex").style.display = "none"; //reference sibling gender
    document.getElementById("references").style.display = "none"; //whole references section
    document.getElementById("pat_ref").style.display = "none"; //just paternal references
    document.getElementById("mat_ref").style.display = "none"; //just maternal reference
    document.getElementById("genotypes").style.display = "none"; //selecting genotypes
    document.getElementById("enter_names").style.display = "none"; //optional family names
    document.getElementById("ref2").style.display = "none";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("download").style.display = "none";
    error_message("");
    //showing sibling radio buttons
    let sibling_radios = document.getElementsByClassName("sibling");
    for (const radio of sibling_radios){
        radio.style.display = "block";
    }
}

//starting state
hide_all();
document.getElementById("inheritance_div").style.display = "block";

//All buttons
//next button on inheritance question
function Inheritance_next(){
    reference_default();
    hide_all();
    if (INHERITANCE != "autosomal_recessive"){ //go to ask about reference type (pat or mat)
        document.getElementById("which_parental").style.display = "block";
    }
    else{ //go to question is reference a sibling?
        document.getElementById("sibling_as_ref").style.display = "block";
        parental_phase = "both";
    }   
}

//asking which parental type for reference after selecting need to move to page to pick who is reference
function Which_parental_next(){
    hide_all();
    parental_phase = document.querySelector('input[name="parental_reference"]:checked').value;
    document.getElementById("references").style.display = "block";
    if (parental_phase == "paternal"){
        document.getElementById("pat_ref").style.display = "block";    
    }
    else if (parental_phase == "maternal"){
        document.getElementById("mat_ref").style.display = "block";
    }
    else{
        return error_message("parental phase isn't right");
    }
}
    
//need to go back to inheritance and clear "parental_phase"
function Inheritance_back(){
    hide_all();
    parental_phase = "";
    document.getElementById("inheritance_div").style.display = "block";
}

//page asking if sibling as ref, if yes need to go to ask gender page if no go to select reference page
function sibling_ref_next(){
    hide_all();
    document.getElementById("sibling_as_ref").style.display = "block";
    let sibling_sex = document.querySelector('input[name="sibling_ref"]:checked').value;
    if (sibling_sex == "sibling_yes"){ //go to page asking for gender
        hide_all();
        document.getElementById("sibling_sex").style.display = "block";
    }
    else if (sibling_sex == "sibling_no"){ //go to page asking for refernces
        hide_all();
        //show both paternal and maternal reference options but hide sibling buttons
        document.getElementById("references").style.display = "block"; //whole references section
        document.getElementById("pat_ref").style.display = "block"; //just paternal references
        document.getElementById("mat_ref").style.display = "block"; //just maternal reference
        //hiding sibling radio buttons
        let sibling_radios = document.getElementsByClassName("sibling");
        for (const radio of sibling_radios){
            radio.style.display = "none";
        }
    }
}
function sibling_sex_next(){//autosomal recessive selecting gender of sibling and moving to genotype page
    inheritance();
    hide_all();
    document.getElementById("genotypes").style.display = "block"; //selecting genotypes
    //Will use maternal genotype only and this will fill for both options + hide lable so now it says sibling
    document.getElementById("ref2").style.display = "block";//show sibling label for genotyping
    //hide sibling class elements
    let sibling_radios = document.getElementsByClassName("sibling");
        for (const radio of sibling_radios){
            radio.style.display = "none";
        }
}

function reference_next(){//move to genotyping page
    inheritance();
    let refM = document.querySelector('input[name="referenceM"]:checked').value;
    let refP = document.querySelector('input[name="referenceP"]:checked').value;
    if (refM == "none" && refP == "none"){
        return error_message("No reference selected");
    }
    if (INHERITANCE == "autosomal_recessive" && (refM == "none" || refP == "none")){
        return error_message("Must select both references");
    }
    hide_all();
    document.getElementById("genotypes").style.display = "block"; //selecting genotypes
}

function Add_names(){
    document.getElementById("genotypes").style.display = "none"; //hide genotypes
    document.getElementById("enter_names").style.display = "block"; //optional family names
}

function remove_names(){
    document.getElementById("genotypes").style.display = "block"; //hide genotypes
    document.getElementById("enter_names").style.display = "none"; //optional family names
}

function reference_default(){
    document.getElementById("noneM").checked = true;
    document.getElementById("noneP").checked = true;
    document.getElementById("references").style.display = "none";
    if (parental_phase == "both"){
        document.getElementById("inheritance_div").style.display = "block";
    }
    else{
        document.getElementById("which_parental").style.display = "block";
    }
}

//saving image
download_img = function(el) {
    // get image URI from canvas object
    var imageURI = canvas.toDataURL("image/jpg");
    el.href = imageURI;
  };
