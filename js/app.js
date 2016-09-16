var neighbourhood = [
    {
        addressLine1: '456 High St',
        addressLine2: 'Preston VIC 3072',
        addressLine3: '',
        addressLine4: '',
        latLng: { lat:-37.736144, lng:145.00451499999997 }
    },
    {
        addressLine1: '80 Cochranes Rd',
        addressLine2: 'Moorabbin VIC 3189',
        addressLine3: '',
        addressLine4: '',
        latLng: { lat:-37.9437494, lng:145.0694519 }
    },
    {
        addressLine1: '35 Ebden St',
        addressLine2: 'Moorabbin VIC 3189',
        addressLine3: '',
        addressLine4: '',
        latLng: { lat:-37.940406, lng:145.06770800000004 }
    },
    {
        addressLine1: '87 Kingsway',
        addressLine2: 'Glen Waverley VIC 3150',
        addressLine3: '',
        addressLine4: '',
        latLng: { lat:-37.880845, lng:145.16328499999997 }
    },
    {
        addressLine1: '88 Kingsway',
        addressLine2: 'Glen Waverley VIC 3150',
        addressLine3: '',
        addressLine4: '',
        latLng: { lat:-37.88118, lng:145.16391299999998 }
    },
    {
        addressLine1: '25/27 Portman St',
        addressLine2: 'Oakleigh VIC 3166',
        addressLine3: '',
        addressLine4: '',
        latLng: { lat:-37.899998, lng:145.08981700000004 }
    },
    {
        addressLine1: '402 Chapel St',
        addressLine2: 'South Yarra VIC 3141',
        addressLine3: '',
        addressLine4: '',
        latLng: { lat:-37.8451966, lng:144.99473950000004}
    },
    {
        addressLine1: '413 Brunswick St',
        addressLine2: 'Fitzroy VIC 3065',
        addressLine3: '',
        addressLine4: '',
        latLng: { lat:-37.79459, lng:144.978878 }
    }
];



var NeighbourhoodLocation = function (data) {
    this.addressLine1 = ko.observable(data.addressLine1);
    this.addressLine2 = ko.observable(data.addressLine2);
    this.addressLine3 = ko.observable(data.addressLine3);
    this.addressLine4 = ko.observable(data.addressLine4);
    this.latLng = ko.observable(data.latLng);

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

    self.neigbourhoodList = ko.observableArray([]);
    neighbourhood.forEach(function(neighbourhoodItem){
        self.neigbourhoodList.push(new NeighbourhoodLocation(neighbourhoodItem));
    });

    self.filter =  ko.observable("");

    self.filteredNeigbourhoodList = ko.computed(function()
    {
        clearMarkers();
        return ko.utils.arrayFilter(self.neigbourhoodList(), function(item)
        {
            if (item.addressLine1().toLowerCase().indexOf(self.filter().toLowerCase()) !== -1)
            {
                addMarkerToGoogleMap(item.fullAddress(), false);
                centreMap();
            }
            return item.addressLine1().toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
        });

    }, self).extend({ throttle: 500 });


    self.setNeighbourhoodLocation = function(clickedNeighbourhoodLocation) {
        openInfoWindowByAddress(clickedNeighbourhoodLocation);
    };

}

ko.applyBindings(new ViewModel());