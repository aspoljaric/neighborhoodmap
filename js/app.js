var neighbourhood = [
    {
        addressLine1: '456 High St',
        addressLine2: 'Preston VIC 3072',
        addressLine3: '',
        addressLine4: '',
    },
    {
        addressLine1: '80 Cochranes Rd',
        addressLine2: 'Moorabbin VIC 3189',
        addressLine3: '',
        addressLine4: '',
    },
    {
        addressLine1: '35 Ebden St',
        addressLine2: 'Moorabbin VIC 3189',
        addressLine3: '',
        addressLine4: '',
    },
    {
        addressLine1: '87 Kingsway',
        addressLine2: 'Glen Waverley VIC 3150',
        addressLine3: '',
        addressLine4: '',
    },
    {
        addressLine1: '88 Kingsway',
        addressLine2: 'Glen Waverley VIC 3150',
        addressLine3: '',
        addressLine4: '',
    },
    {
        addressLine1: '17-21 Eaton Mall',
        addressLine2: 'Oakleigh VIC 3166',
        addressLine3: '',
        addressLine4: '',
    },
    {
        addressLine1: '2/402 Chapel St',
        addressLine2: 'South Yarra VIC 3141',
        addressLine3: '',
        addressLine4: '',
    },
    {
        addressLine1: 'Crown Towers Melbourne',
        addressLine2: 'Crown Casino',
        addressLine3: '8 Whiteman St',
        addressLine4: 'Southbank VIC 3006',
    }
];



var NeighbourhoodLocation = function (data) {
    this.addressLine1 = ko.observable(data.addressLine1);
    this.addressLine2 = ko.observable(data.addressLine2);
    this.addressLine3 = ko.observable(data.addressLine3);
    this.addressLine4 = ko.observable(data.addressLine4);

    this.fullAddress = ko.computed(function() {
        var address = '';
        if(this.addressLine1() != '') {
            address += this.addressLine1();
        }
        if(this.addressLine2() != '') {
            address += ', ' + this.addressLine2();
        }
        if(this.addressLine3() != '') {
            address += ', ' + this.addressLine3();
        }
        if(this.addressLine4() != '') {
            address += ', ' + this.addressLine4();
        }
        return address;
    }, this);
}



var ViewModel = function() {
    var self = this;

    this.neigbourhoodList = ko.observableArray([]);

    neighbourhood.forEach(function(neighbourhoodItem){
        self.neigbourhoodList.push(new NeighbourhoodLocation(neighbourhoodItem));
    });

    this.currentNeighbourhoodLocation = ko.observable(this.neigbourhoodList()[0]);

    // this.incrementCounter = function() {
    //     self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    // };

    self.setNeighbourhoodLocation = function(clickedNeighbourhoodLocation) {
        self.currentNeighbourhoodLocation(clickedNeighbourhoodLocation);
        clearMarkers();
        addMarkerToGoogleMap(clickedNeighbourhoodLocation.fullAddress(), true);
    };

}

ko.applyBindings(new ViewModel());