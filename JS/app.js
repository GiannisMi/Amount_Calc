class RaceApp {
  constructor(price) {
    this.price = price;
  }
}

class MoneyList {
  constructor(listSelector) {
    if (sessionStorage.getItem("list") == null) {
      sessionStorage.setItem("list", "[]");
    }
    if (sessionStorage.getItem("list2") == null) {
      sessionStorage.setItem("list2", "[]");
    }
    this.listApp = JSON.parse(sessionStorage.getItem("list"));
    this.listRoad = JSON.parse(sessionStorage.getItem("list2"));
    this.$list = document.querySelector(listSelector);
    this.initialize();
    this.renderRaces();
    this.RenderRacesRoad();
    this.addEvents();
    this.details();
  }

  initialize() {
    const template = `
        
        <div  class ="textarea show">
        <div class="results ">
          <div class="col ">
            <span>ΣΥΝΟΛΟ ΔΙΑΔΡΟΜΩΝ APP:<span class="app-races"></span></span>
          </div>
          <div class="col ">
            <span>ΣΥΝΟΛΟ ΔΙΑΔΡΟΜΩΝ ROAD:<span class="road-races"></span></span>
          </div>
          <div class="col ">
            <span>ΣΥΝΟΛΟ ΔΙΑΔΡΟΜΩΝ:<span class="races"></span></span>
          </div>   
          <div class="col ">
            <span>ΣΥΝΟΛΟ ΠΟΣΟΥ:<span class="price-result"></span></span>
          </div>     
         </div>
         </div>

         <div class="row title">
          
         <div class="col-xs" ><h5>TAXI APP</h5></div>
         <div class="col-xs">
         <button id="details">Show Details</button>
         </div>
         <div class="col-xs"><h5>ROAD</h5></div>
         
         </div>
         <div class="row money">    
              <div class="col input-group mb-3">
                    <input type="number" class="form-control race-app-entry" placeholder="Enter Price"/>               
             
             <div class="input-group-append">
                    <button class=" add-app-race">Add</button>
                    
             </div>
             </div>
             <div class="col input-group mb-3">
                 <input type="number" class="form-control race-road-entry" placeholder="Enter Price"/>
             
             <div class="input-group-append">
                 <button class=" add-road-race">Add</button>
             </div>
             </div>
             
          </div>
       
         <div class = " row apprace">
          <div class="col appresult">

         </div>  
         <div class="col roadresult">

         </div>  
        
         </div>
        `;
    this.$list.innerHTML = template;
  }

  addEvents() {
    this.$RaceEntryApp = this.$list.querySelector(".race-app-entry");
    this.$RaceAppAddButton = this.$list.querySelector(".add-app-race");
    this.$RaceEntryRoad = this.$list.querySelector(".race-road-entry");
    this.$RaceRoadAddButton = this.$list.querySelector(".add-road-race");
    this.$details = this.$list.querySelector("#details");
    this.$Appraces = this.$list.querySelector(".app-races");
    this.$Roadraces = this.$list.querySelector(".road-races");
    this.$Resultraces = this.$list.querySelector(".races");
    this.$Resultprice = this.$list.querySelector(".price-result");

    this.$details.addEventListener("click", this.popup.bind(this));
    this.$RaceRoadAddButton.addEventListener(
      "click",
      this.handleAddRoadRace.bind(this)
    );
    this.$RaceAppAddButton.addEventListener(
      "click",
      this.handleAddAppRace.bind(this)
    );
    this.$list.addEventListener("click", this.handleRaceClick.bind(this));
  }

  details() {
    let racesapplength = this.listApp.length;
    let racesroadlength = this.listRoad.length;
    let resulstraces = racesapplength + racesroadlength;
    let resprice = 0;
    let discount = 0;
    let result = 0;

    this.listApp.forEach((item) => {
      resprice = parseFloat(item);
      result += resprice - discount;
    });
    this.listRoad.forEach((item) => {
      result += parseFloat(item);
    });

    this.$Appraces.textContent = racesapplength;
    this.$Roadraces.textContent = racesroadlength;
    this.$Resultraces.textContent = resulstraces;
    this.$Resultprice.textContent = result.toFixed(2);
  }

  popup() {
    $(".textarea ").toggle(1000);
    this.$details.classList.toggle("press");
  }

  handleAddRoadRace(e) {
    const price = this.$RaceEntryRoad.value;
    if (price && price >= 0) {
      const newRace = new RaceApp(price);
      this.addRaceRoad(newRace);
      this.$RaceEntryRoad.value = "";
    }
  }

  handleAddAppRace(e) {
    const price = this.$RaceEntryApp.value;
    if (price && price >= 0) {
      const newRace = new RaceApp(price);
      this.addRaceApp(newRace);
      this.$RaceEntryApp.value = "";
    }
  }
  handleRaceClick(e) {
    const className = e.target.className;
    if (className.includes("delete-race-app")) {
      this.deleteRaceApp(e);
    } else if (className.includes("delete-race-road")) {
      this.deleteRaceRoad(e);
    }
  }

  deleteRaceApp(e) {
    const $race = e.target.closest(".alertapp");
    const idparts = $race.id.split("-");
    const index = parseInt(idparts[1]);
    this.listApp.splice(index, 1);
    sessionStorage.setItem("list", JSON.stringify(this.listApp));
    this.renderRaces();
    this.details();
  }

  deleteRaceRoad(e) {
    const $race = e.target.closest(".alertroad");
    const idparts = $race.id.split("-");
    const index = parseInt(idparts[1]);
    this.listRoad.splice(index, 1);
    sessionStorage.setItem("list2", JSON.stringify(this.listRoad));
    this.RenderRacesRoad();
    this.details();
  }

  addRaceApp(race) {
    let discountprice = this.discount(race.price);
    this.listApp.push(discountprice.toFixed(2));
    sessionStorage.setItem("list", JSON.stringify(this.listApp));
    this.renderRaces();
    this.details();
  }

  addRaceRoad(race) {
    this.listRoad.push(race.price);
    sessionStorage.setItem("list2", JSON.stringify(this.listRoad));
    this.RenderRacesRoad();
    this.details();
  }

  RenderRacesRoad() {
    const $listRaces = this.$list.querySelector(".roadresult");
    const racesTemplate = this.listRoad.map((item, i) => {
      return `
            
                <div id=road-${i} class="row alertroad">
                    <div class="col-1 count">${i + 1})</div>
                    <div class="appmoney col">${item}</div>
                    <div class="col"><button class="btn btn-danger delete-race-road">X</button></div>
                </div>          
                   

            `;
    });
    $listRaces.innerHTML = racesTemplate.join("");
  }

  renderRaces() {
    const $listRaces = this.$list.querySelector(".appresult");
    const racesTemplate = this.listApp.map((item, i) => {
      return `
                <div id=app-${i} class="row alertapp">
                    <div class="col-1 count">${i + 1})</div>
                    <div class="appmoney col">${item}</div>
                    <div class="col"><button class="btn btn-danger delete-race-app">X</button></div>
                </div>          
                   

            `;
    });

    $listRaces.innerHTML = racesTemplate.join("");
  }

  discount(race) {
    let discount = (race * 12) / 100;
    let result = race - discount;
    return result;
  }
}

const race1 = new RaceApp(22);
const race2 = new RaceApp(35);
const race3 = new RaceApp(33);
const race5 = new RaceApp(5555);
const race4 = new RaceApp(4444);
const race45 = new RaceApp(100000);
const list = new MoneyList(".racelist");
