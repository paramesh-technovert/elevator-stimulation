var floors = 0;
var capacity = 0;
var currentCapacity = 0;
var liftPosition = 0;
var directionUp = true;
var isEnabled = true;
var upList = [];
var downList = [];
var onBoardedUsers = [];
function updateFloors() {
  var inputFloors = document.getElementById("floors").value;
  var inputCapacity = document.getElementById("capacity").value;
  var confirmation = confirm(
    "Stimulation will start with " +
      inputFloors +
      " floors and a capacity of " +
      inputCapacity
  );
  if (confirmation) {
    if (inputFloors > 0 && inputCapacity > 0) {
      floors = inputFloors;
      capacity = inputCapacity;
      document.getElementById("container").style.display = "none";
      document.getElementById("userInputContainer").style.display = "block";
      elevatorInitialization();
    } else if (inputFloors <= 0) {
      alert("Invalid input: " + inputFloors + "Please enter a valid number");
    } else {
      alert("Invalid input: " + inputCapacity + "Please enter a valid number");
    }
  }
}
function inputUsers() {
  if (capacity > currentCapacity) {
    var floor = document.getElementById("userInput").value;
    if (Number(floor) <= Number(floors)) {
      if (Number(floor) != Number(liftPosition)) {
        onBoardedUsers.push(floor);
        currentCapacity += 1;
        document.getElementById(
          liftPosition
        ).innerHTML += `<span class="user">${floor}<span>`;
      } else {
        alert("User Must go to different floor");
      }
    } else {
      alert("Invalid Floor");
    }
  } else {
    alert("Max Capacity reached");
  }
  document.getElementById("userInput").value = "";
}
function elevatorInitialization() {
  var element = document.getElementById("elevatorDisplay");
  var code = "";
  for (var i = floors; i > -1; i--) {
    code += `<div class="elevator-level d-flex">
        <div class="flex-fill display-text">${i}
        </div>
        <div class="square" id="${i}"></div>
        <div class="directions d-flex flex-fill">
            <div>`;
    if (i != floors) {
      code += `<div><button type="button" value="${i}" onclick="updateUp(value)" id="up${i}">
            &#x25B2
        </button></div>`;
    }
    if (i != 0) {
      code += `<div><button type="button" value="${i}" onclick="updateDown(value)" id="down${i}">
            &#x25BC
        </button></div>`;
    }
    code += `</div>
    </div>
</div>`;
  }
  element.innerHTML = code;
  document.getElementById(liftPosition).style.background = "yellow";
}
function updateUp(floorNumber) {
  if (Number(liftPosition) != Number(floorNumber)) {
    if (!(floorNumber in upList)) upList.push(floorNumber);
    event.target.style.border = "2px solid red";
    if (
      upList.length == 1 &&
      downList.length == 0 &&
      onBoardedUsers.length == 0
    ) {
      start();
    }
  }
}
function updateDown(floorNumber) {
  if (Number(liftPosition) != Number(floorNumber)) {
    if (!(floorNumber in downList)) downList.push(floorNumber);
    event.target.style.border = "2px solid red";
    if (
      downList.length == 1 &&
      upList.length == 0 &&
      onBoardedUsers.length == 0
    ) {
      start();
    }
  }
}
function start() {
  directionUp = setDirection();
  updatePos();
  updatedState();
}
function setDirection() {
  if (Number(floors) == liftPosition) {
    return false;
  }
  if (liftPosition == 0) {
    return true;
  }
  if (directionUp) {
    if ((
      (upList?.filter((x) => Number(x) > Number(liftPosition)) ?? []).length > 0 ||
      (onBoardedUsers?.filter((x) => Number(x) > Number(liftPosition)) ?? []).length > 0 ||
      (downList?.filter((x) => Number(x) > Number(liftPosition)) ?? []).length > 0
    )) {
      return true;
    } else {
      return false;
    }
  } else {
    if ((
      (downList?.filter((x) => Number(x) < Number(liftPosition)) ?? []).length > 0 ||
      (onBoardedUsers?.filter((x) => Number(x) < Number(liftPosition)) ?? []).length > 0 ||
      (upList?.filter((x) => Number(x) < Number(liftPosition)) ?? []).length > 0
    )) {
      return false;
    } else {
      return true;
    }
  }
}
function updatePos() {
  if (upList.length > 0 || downList.length > 0 || onBoardedUsers.length > 0) {
    if (
      directionUp &&
      Number(floors) != Number(liftPosition) &&
      ((upList?.filter((x) => Number(x) > Number(liftPosition)) ?? []).length > 0 ||
        (downList?.filter((x) => Number(x) > Number(liftPosition)) ?? []).length > 0 ||
        (onBoardedUsers.filter((x) => Number(x) > Number(liftPosition)) ?? []).length >0)
    ) {
      document.getElementById(liftPosition).style.background = "gray";
      document.getElementById(liftPosition).innerHTML = "";
      liftPosition += 1;
      document.getElementById(liftPosition).style.background = "yellow";
    } else {
      if (
        (liftPosition != 0 &&
          ((upList?.filter((x) => Number(x) < Number(liftPosition)) ?? []).length > 0 ||
            (downList?.filter((x) => Number(x) < Number(liftPosition)) ?? []).length >0)) ||
        (onBoardedUsers.filter((x) => Number(x) < Number(liftPosition)) ?? []).length >0
      ) {
        document.getElementById(liftPosition).style.background = "gray";
        document.getElementById(liftPosition).innerHTML = "";
        liftPosition -= 1;
        document.getElementById(liftPosition).style.background = "yellow";
      }
    }
  }
}
function updatedState() {
  if (directionUp) {
    if (
      upList?.includes(liftPosition.toString()) ||
      onBoardedUsers?.includes(liftPosition.toString())
    ) {
      var curUsers = onBoardedUsers.length;
      upList = upList?.filter((x) => Number(x) != Number(liftPosition)) ?? [];
      onBoardedUsers =
        onBoardedUsers?.filter((x) => Number(x) != Number(liftPosition)) ?? [];
      currentCapacity -= curUsers - onBoardedUsers.length;
      if(Number(liftPosition)!=Number(floors))
      document.getElementById("up" + liftPosition).style.border =
        "2px solid grey";
      var code = '<div class="d-flex">';
      for (var i = 0; i < onBoardedUsers.length; i++) {
        code += `<span class="user">${onBoardedUsers[i]}<span>`;
      }
      code += `</div>`;
      document.getElementById(liftPosition).innerHTML = code;
    } else {
      var code = '<div class="d-flex">';
      for (var i = 0; i < onBoardedUsers.length; i++) {
        code += `<span class="user">${onBoardedUsers[i]}<span>`;
      }
      code += `</div>`;
      document.getElementById(liftPosition).innerHTML = code;
      if (
        downList?.includes(liftPosition.toString()) &&
        ( 
          upList.filter((x) => Number(x) > Number(liftPosition)).length == 0 || onBoardedUsers.filter((x)=>Number(x)>Number(liftPosition).length==0)
      )){
        directionUp = false;
        if(Number(liftPosition)!=0)
        document.getElementById("down" + liftPosition).style.border =
          "2px solid grey";
      } else {
        setTimeout(start, 2000);
      }
    }
  } else {
    if (
      downList?.includes(liftPosition.toString()) ||
      onBoardedUsers?.includes(liftPosition.toString())
    ) {
      var curUsers = onBoardedUsers.length;
      downList = downList?.filter((x) => Number(x) != Number(liftPosition)) ?? [];
      onBoardedUsers =
        onBoardedUsers?.filter((x) => Number(x) != Number(liftPosition)) ?? [];
      currentCapacity -= curUsers - onBoardedUsers.length;
      document.getElementById("down" + liftPosition).style.border =
        "2px solid grey";
      var code = '<div class="d-flex">';
      for (var i = 0; i < onBoardedUsers.length; i++) {
        code += `<span class="user">${onBoardedUsers[i]}<span>`;
      }
      code += `</div>`;
      document.getElementById(liftPosition).innerHTML = code;
    } else {
      var code = '<div class="d-flex">';
      for (var i = 0; i < onBoardedUsers.length; i++) {
        code += `<span class="user">${onBoardedUsers[i]}<span>`;
      }
      code += `</div>`;
      document.getElementById(liftPosition).innerHTML = code;
      if (
        upList.includes(liftPosition.toString()) &&
        (
          downList.filter((x) => Number(x) < Number(liftPosition)).length == 0|| onBoardedUsers.filter((x)=>Number(x)<Number(liftPosition).length==0))
      ) {
        directionUp = true;
        document.getElementById("up" + liftPosition).style.border =
          "2px solid grey";
      } else {
        setTimeout(start, 2000);
      }
    }
  }
}
