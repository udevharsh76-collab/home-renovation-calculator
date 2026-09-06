import { useEffect, useMemo, useState } from "react";

const UNITS = [
  "pcs",
  "nos",
  "bags",
  "kg",
  "g",
  "ton",
  "m",
  "ft",
  "running ft",
  "sq.ft",
  "sq.m",
  "cu.ft",
  "cu.m",
  "litre",
  "ml",
  "box",
  "roll",
  "bundle",
  "sheet",
  "set",
  "pair",
  "tube",
  "load",
  "truck",
];

const STORAGE_KEY = "renovatecalc_shopping_list";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

/* ============================================================
   COMPLETE RENOVATION SHOPPING DATABASE
   ============================================================ */

const SHOPPING_DATABASE = {
  "Civil & Masonry": {
    Bricks: {
      types: ["Red Clay Brick", "Fly Ash Brick", "Concrete Brick", "AAC Block"],
      unit: "pcs",
    },
    Cement: {
      types: ["OPC 43 Grade", "OPC 53 Grade", "PPC", "PSC", "White Cement"],
      unit: "bags",
    },
    Sand: {
      types: ["River Sand", "M-Sand", "Plaster Sand", "Fine Sand"],
      unit: "cu.ft",
    },
    Aggregate: {
      types: ["10 mm", "20 mm", "40 mm", "Coarse Aggregate"],
      unit: "cu.ft",
    },
    Concrete: {
      types: ["PCC", "RCC", "M10", "M15", "M20", "M25", "M30"],
      unit: "cu.ft",
    },
    "AAC Blocks": {
      types: ["4 inch", "6 inch", "8 inch", "9 inch"],
      unit: "pcs",
    },
    "Fly Ash Blocks": {
      types: ["4 inch", "6 inch", "8 inch", "9 inch"],
      unit: "pcs",
    },
    Mortar: {
      types: ["Cement Mortar", "Ready Mortar", "Polymer Mortar"],
      unit: "bags",
    },
    "Ready-Mix Concrete": {
      types: ["M15", "M20", "M25", "M30", "M35"],
      unit: "cu.m",
    },
    "Binding Wire": {
      types: ["18 Gauge", "20 Gauge", "22 Gauge"],
      unit: "kg",
    },
    "Steel / TMT Bars": {
      types: ["8 mm", "10 mm", "12 mm", "16 mm", "20 mm", "25 mm", "32 mm"],
      unit: "kg",
    },
    "Reinforcement Mesh": {
      types: ["Welded Mesh", "GI Mesh", "MS Mesh", "BRC Mesh"],
      unit: "sq.ft",
    },
    "GI Wire": {
      types: ["18 Gauge", "20 Gauge", "22 Gauge", "24 Gauge"],
      unit: "kg",
    },
    "Construction Chemicals": {
      types: [
        "Bonding Agent",
        "Plasticizer",
        "Admixture",
        "Curing Compound",
        "Repair Chemical",
      ],
      unit: "litre",
    },
  },

  "Wall & Surface": {
    Cement: {
      types: ["OPC 43 Grade", "OPC 53 Grade", "PPC", "White Cement"],
      unit: "bags",
    },
    Sand: {
      types: ["River Sand", "M-Sand", "Plaster Sand", "Fine Sand"],
      unit: "cu.ft",
    },
    "Plaster Material": {
      types: [
        "Cement Plaster",
        "Ready Mix Plaster",
        "Gypsum Plaster",
        "Polymer Plaster",
      ],
      unit: "bags",
    },
    "Wall Putty": {
      types: [
        "Cement Based",
        "Acrylic",
        "White Cement Putty",
        "Premium Putty",
      ],
      unit: "kg",
    },
    Primer: {
      types: [
        "Interior Primer",
        "Exterior Primer",
        "Wall Primer",
        "Alkali Resistant Primer",
      ],
      unit: "litre",
    },
    "Interior Paint": {
      types: [
        "Economy Emulsion",
        "Premium Emulsion",
        "Luxury Emulsion",
        "Acrylic Emulsion",
      ],
      unit: "litre",
    },
    "Exterior Paint": {
      types: [
        "Exterior Emulsion",
        "Weather Coat",
        "Acrylic Exterior",
        "Weatherproof Paint",
      ],
      unit: "litre",
    },
    "Texture Paint": {
      types: [
        "Sand Texture",
        "Roller Texture",
        "Stone Texture",
        "Designer Texture",
      ],
      unit: "kg",
    },
    "Waterproofing Material": {
      types: [
        "Cementitious",
        "Acrylic",
        "PU",
        "Integral Waterproofing",
      ],
      unit: "kg",
    },
    "Crack Filler": {
      types: [
        "Wall Crack Filler",
        "Acrylic Crack Filler",
        "Cement Crack Filler",
      ],
      unit: "kg",
    },
    Sealant: {
      types: ["Acrylic", "Silicone", "PU", "Construction Sealant"],
      unit: "tube",
    },
    POP: {
      types: ["POP Powder", "POP Plaster", "POP Cornice"],
      unit: "kg",
    },
    Gypsum: {
      types: ["Gypsum Plaster", "Gypsum Powder", "Gypsum Board"],
      unit: "kg",
    },
    "Joint Compound": {
      types: ["Ready Mix", "Powder", "Gypsum Joint Compound"],
      unit: "kg",
    },
    "Wall Panels": {
      types: ["PVC", "WPC", "MDF", "Wood", "3D Panel"],
      unit: "sq.ft",
    },
  },

  Flooring: {
    "Floor Tiles": {
      types: [
        "Ceramic",
        "Vitrified",
        "Porcelain",
        "Digital",
        "Anti-Skid",
      ],
      unit: "sq.ft",
    },
    "Wall Tiles": {
      types: [
        "Ceramic",
        "Vitrified",
        "Porcelain",
        "Digital",
        "Glossy",
        "Matt",
      ],
      unit: "sq.ft",
    },
    Marble: {
      types: ["White Marble", "Indian Marble", "Imported Marble"],
      unit: "sq.ft",
    },
    Granite: {
      types: [
        "Black Granite",
        "White Granite",
        "Grey Granite",
        "Galaxy Granite",
      ],
      unit: "sq.ft",
    },
    "Vitrified Tiles": {
      types: [
        "Glossy",
        "Matt",
        "Double Charge",
        "Full Body",
        "Digital",
      ],
      unit: "sq.ft",
    },
    "Ceramic Tiles": {
      types: ["Glossy", "Matt", "Wall Ceramic", "Floor Ceramic"],
      unit: "sq.ft",
    },
    "Kota Stone": {
      types: ["Kota Blue", "Kota Brown", "Kota Green"],
      unit: "sq.ft",
    },
    "Wooden Flooring": {
      types: ["Laminate", "Engineered Wood", "Solid Wood"],
      unit: "sq.ft",
    },
    "Vinyl Flooring": {
      types: ["PVC Vinyl", "SPC", "LVT", "Vinyl Plank"],
      unit: "sq.ft",
    },
    "Tile Adhesive": {
      types: ["Regular", "Heavy Duty", "Flexible", "Large Format"],
      unit: "bags",
    },
    "Tile Grout": {
      types: ["Cement Grout", "Epoxy Grout", "Colored Grout"],
      unit: "kg",
    },
    Spacers: {
      types: ["1 mm", "2 mm", "3 mm", "5 mm", "8 mm", "10 mm"],
      unit: "pcs",
    },
    "Leveling Clips": {
      types: ["1 mm", "2 mm", "3 mm", "5 mm"],
      unit: "pcs",
    },
    Skirting: {
      types: ["Tile", "Marble", "Granite", "PVC"],
      unit: "running ft",
    },
    "Flooring Adhesive": {
      types: ["PU", "Epoxy", "Acrylic", "Wood Adhesive"],
      unit: "kg",
    },
  },

  Bathroom: {
    "Floor Tiles": {
      types: ["Anti-Skid", "Vitrified", "Ceramic", "Porcelain"],
      unit: "sq.ft",
    },
    "Wall Tiles": {
      types: [
        "Ceramic",
        "Vitrified",
        "Porcelain",
        "Digital",
        "Matt",
        "Glossy",
      ],
      unit: "sq.ft",
    },
    "Tile Adhesive": {
      types: ["Regular", "Heavy Duty", "Flexible", "Large Format"],
      unit: "bags",
    },
    Grout: {
      types: ["Cement", "Epoxy", "Colored"],
      unit: "kg",
    },
    Waterproofing: {
      types: ["Cementitious", "Acrylic", "PU", "Liquid Membrane"],
      unit: "kg",
    },
    WC: {
      types: ["Western", "Wall Hung", "One Piece", "Two Piece"],
      unit: "pcs",
    },
    "Wash Basin": {
      types: ["Table Top", "Wall Hung", "Pedestal", "Counter Basin"],
      unit: "pcs",
    },
    Faucet: {
      types: ["Basin Mixer", "Pillar Cock", "Wall Mixer", "Bib Cock"],
      unit: "pcs",
    },
    Shower: {
      types: [
        "Overhead Shower",
        "Hand Shower",
        "Rain Shower",
        "Shower Set",
      ],
      unit: "pcs",
    },
    "Health Faucet": {
      types: ["ABS", "Brass", "SS"],
      unit: "pcs",
    },
    "Floor Drain": {
      types: ["SS Floor Drain", "CP Floor Drain", "Tile Insert Drain"],
      unit: "pcs",
    },
    "Waste Coupling": {
      types: ["32 mm", "40 mm", "50 mm"],
      unit: "pcs",
    },
    "Bottle Trap": {
      types: ["32 mm", "40 mm", "50 mm"],
      unit: "pcs",
    },
    "Angle Valve": {
      types: ["15 mm", "20 mm", "Chrome Plated"],
      unit: "pcs",
    },
    "Flexible Hose": {
      types: ["300 mm", "450 mm", "600 mm", "900 mm"],
      unit: "pcs",
    },
    "CP Fittings": {
      types: ["Chrome Plated", "Brass", "SS"],
      unit: "pcs",
    },
    Pipes: {
      types: ["CPVC", "UPVC", "PVC", "PPR"],
      unit: "m",
    },
    "Pipe Fittings": {
      types: ["Elbow", "Tee", "Coupler", "Reducer", "Adapter"],
      unit: "pcs",
    },
    Valves: {
      types: ["Ball Valve", "Gate Valve", "Angle Valve", "NRV"],
      unit: "pcs",
    },
    Mirror: {
      types: ["Plain", "LED", "Anti-Fog", "Designer"],
      unit: "pcs",
    },
    "Bathroom Accessories": {
      types: [
        "Towel Rod",
        "Towel Ring",
        "Soap Dish",
        "Robe Hook",
        "Toilet Paper Holder",
      ],
      unit: "set",
    },
    "Exhaust Fan": {
      types: ["6 inch", "8 inch", "10 inch", "12 inch"],
      unit: "pcs",
    },
    "Silicone / Sealant": {
      types: [
        "Clear Silicone",
        "White Silicone",
        "Sanitary Silicone",
        "PU Sealant",
      ],
      unit: "tube",
    },
  },

  Plumbing: {
    "CPVC Pipe": {
      types: ["15 mm", "20 mm", "25 mm", "32 mm", "40 mm", "50 mm"],
      unit: "m",
    },
    "UPVC Pipe": {
      types: ["20 mm", "25 mm", "32 mm", "40 mm", "50 mm", "75 mm", "110 mm"],
      unit: "m",
    },
    "PVC Pipe": {
      types: ["20 mm", "25 mm", "32 mm", "40 mm", "50 mm", "75 mm", "110 mm"],
      unit: "m",
    },
    "PPR Pipe": {
      types: ["20 mm", "25 mm", "32 mm", "40 mm", "50 mm"],
      unit: "m",
    },
    "HDPE Pipe": {
      types: ["20 mm", "25 mm", "32 mm", "40 mm", "50 mm", "63 mm"],
      unit: "m",
    },
    "SWR Pipe": {
      types: ["75 mm", "110 mm", "160 mm"],
      unit: "m",
    },
    "Elbow/Tee/Coupler/Union/Socket/End Cap": {
      types: [
        "15 mm",
        "20 mm",
        "25 mm",
        "32 mm",
        "40 mm",
        "50 mm",
      ],
      unit: "pcs",
    },
    Reducer: {
      types: ["20x15 mm", "25x20 mm", "32x25 mm", "40x32 mm", "50x40 mm"],
      unit: "pcs",
    },
    Adapter: {
      types: ["Male", "Female", "Brass", "Threaded"],
      unit: "pcs",
    },
    Bend: {
      types: ["45 Degree", "90 Degree", "Long Bend", "Short Bend"],
      unit: "pcs",
    },
    "Ball Valve": {
      types: ["15 mm", "20 mm", "25 mm", "32 mm", "Brass", "SS"],
      unit: "pcs",
    },
    "Gate Valve": {
      types: ["15 mm", "20 mm", "25 mm", "32 mm", "40 mm", "50 mm"],
      unit: "pcs",
    },
    NRV: {
      types: ["15 mm", "20 mm", "25 mm", "32 mm", "40 mm", "50 mm"],
      unit: "pcs",
    },
    "Angle Valve": {
      types: ["15 mm", "20 mm", "Chrome Plated"],
      unit: "pcs",
    },
    "Flexible Pipe": {
      types: ["300 mm", "450 mm", "600 mm", "900 mm", "1200 mm"],
      unit: "pcs",
    },
    "Pipe Clamps": {
      types: ["15 mm", "20 mm", "25 mm", "32 mm", "40 mm", "50 mm"],
      unit: "pcs",
    },
    "PTFE Tape": {
      types: ["12 mm", "19 mm", "25 mm"],
      unit: "roll",
    },
    "Solvent Cement": {
      types: ["PVC Solvent", "CPVC Solvent", "Heavy Duty"],
      unit: "ml",
    },
    "Pipe Sealant": {
      types: ["Thread Sealant", "PTFE Sealant", "Liquid Sealant"],
      unit: "tube",
    },
    "Water Tank": {
      types: ["500 L", "750 L", "1000 L", "1500 L", "2000 L", "5000 L"],
      unit: "pcs",
    },
    Pump: {
      types: ["0.5 HP", "1 HP", "1.5 HP", "2 HP"],
      unit: "pcs",
    },
    "Pressure Pump": {
      types: ["0.5 HP", "1 HP", "1.5 HP", "2 HP"],
      unit: "pcs",
    },
  },

  Electrical: {
    Wire: {
      types: ["1.0 sq.mm", "1.5 sq.mm", "2.5 sq.mm", "4 sq.mm", "6 sq.mm", "10 sq.mm"],
      unit: "m",
    },
    Switches: {
      types: ["6A", "10A", "16A", "20A", "Bell Push"],
      unit: "pcs",
    },
    Sockets: {
      types: ["6A", "10A", "16A", "20A"],
      unit: "pcs",
    },
    "16A Sockets": {
      types: ["6A", "16A Combined", "16A Heavy Duty", "16A Modular"],
      unit: "pcs",
    },
    "Fan Regulators": {
      types: ["Step Type", "Electronic", "Remote"],
      unit: "pcs",
    },
    "Modular Plates": {
      types: ["2 Module", "4 Module", "6 Module", "8 Module", "12 Module"],
      unit: "pcs",
    },
    "Junction Boxes": {
      types: ["PVC", "Metal", "Flush", "Surface"],
      unit: "pcs",
    },
    "Ceiling Roses": {
      types: ["PVC", "Modular", "Heavy Duty"],
      unit: "pcs",
    },
    Conduit: {
      types: ["16 mm", "20 mm", "25 mm", "32 mm"],
      unit: "m",
    },
    "Conduit Bends": {
      types: ["16 mm", "20 mm", "25 mm", "32 mm"],
      unit: "pcs",
    },
    "Flexible Conduit": {
      types: ["16 mm", "20 mm", "25 mm"],
      unit: "m",
    },
    "LED Bulbs": {
      types: ["5W", "7W", "9W", "12W", "15W", "20W"],
      unit: "pcs",
    },
    "LED Panels": {
      types: ["6W", "12W", "18W", "24W", "36W"],
      unit: "pcs",
    },
    Downlights: {
      types: ["5W", "7W", "9W", "12W", "15W", "18W"],
      unit: "pcs",
    },
    Spotlights: {
      types: ["3W", "5W", "7W", "10W", "12W"],
      unit: "pcs",
    },
    "Strip Lights": {
      types: ["5V", "12V", "24V", "Warm White", "Cool White", "RGB"],
      unit: "m",
    },
    "Outdoor Lights": {
      types: ["Wall Light", "Flood Light", "Garden Light", "Bollard Light"],
      unit: "pcs",
    },
    "Emergency Lights": {
      types: ["Rechargeable", "LED Emergency", "Exit Light"],
      unit: "pcs",
    },
    MCB: {
      types: [
        "SP",
        "DP",
        "TP",
        "TPN",
        "6A",
        "10A",
        "16A",
        "20A",
        "32A",
        "40A",
        "63A",
      ],
      unit: "pcs",
    },
    RCCB: {
      types: ["2 Pole", "4 Pole", "30mA", "100mA"],
      unit: "pcs",
    },
    RCBO: {
      types: ["6A", "10A", "16A", "20A", "32A", "40A"],
      unit: "pcs",
    },
    "Distribution Board": {
      types: ["4 Way", "6 Way", "8 Way", "12 Way", "16 Way", "24 Way"],
      unit: "pcs",
    },
    Isolator: {
      types: ["DP", "TP", "TPN", "40A", "63A", "100A"],
      unit: "pcs",
    },
    SPD: {
      types: ["Type 1", "Type 2", "Type 1+2"],
      unit: "pcs",
    },
    "Earthing Materials": {
      types: [
        "GI Pipe",
        "GI Strip",
        "Copper Plate",
        "Earth Electrode",
        "Earth Compound",
      ],
      unit: "pcs",
    },
    "Ceiling Fans": {
      types: ["1200 mm", "1400 mm", "High Speed", "BLDC"],
      unit: "pcs",
    },
    "Exhaust Fans": {
      types: ["6 inch", "8 inch", "10 inch", "12 inch"],
      unit: "pcs",
    },
    "AC Points": {
      types: ["16A", "20A", "25A", "32A"],
      unit: "pcs",
    },
    "Geyser Points": {
      types: ["16A", "20A", "25A"],
      unit: "pcs",
    },
    "TV Points": {
      types: ["Coaxial", "HDMI", "LAN + TV"],
      unit: "pcs",
    },
    "Refrigerator Point": {
      types: ["6A", "16A"],
      unit: "pcs",
    },
    "Washing Machine Point": {
      types: ["16A", "6A"],
      unit: "pcs",
    },
    "Chimney Point": {
      types: ["16A", "20A"],
      unit: "pcs",
    },
  },

  Kitchen: {
    Cement: {
      types: ["OPC 43", "OPC 53", "PPC"],
      unit: "bags",
    },
    Sand: {
      types: ["River Sand", "M-Sand", "Fine Sand"],
      unit: "cu.ft",
    },
    Tiles: {
      types: ["Ceramic", "Vitrified", "Porcelain", "Digital"],
      unit: "sq.ft",
    },
    "Tile Adhesive": {
      types: ["Regular", "Heavy Duty", "Flexible"],
      unit: "bags",
    },
    Grout: {
      types: ["Cement", "Epoxy", "Colored"],
      unit: "kg",
    },
    Granite: {
      types: ["Black", "White", "Grey", "Galaxy"],
      unit: "sq.ft",
    },
    Marble: {
      types: ["Indian", "Imported", "White"],
      unit: "sq.ft",
    },
    Quartz: {
      types: ["White", "Grey", "Black", "Designer"],
      unit: "sq.ft",
    },
    "Edge Profile": {
      types: ["SS", "Aluminium", "PVC", "Brass"],
      unit: "running ft",
    },
    Adhesive: {
      types: ["Epoxy", "Construction Adhesive", "PU"],
      unit: "kg",
    },
    "Kitchen Sink": {
      types: ["Single Bowl", "Double Bowl", "Single Bowl with Drainboard"],
      unit: "pcs",
    },
    "Waste Coupling": {
      types: ["32 mm", "40 mm", "50 mm"],
      unit: "pcs",
    },
    "Bottle Trap": {
      types: ["32 mm", "40 mm", "50 mm"],
      unit: "pcs",
    },
    Faucet: {
      types: ["Sink Mixer", "Pillar Cock", "Pull Out Faucet"],
      unit: "pcs",
    },
    "Flexible Hose": {
      types: ["300 mm", "450 mm", "600 mm"],
      unit: "pcs",
    },
    "Angle Valve": {
      types: ["15 mm", "20 mm", "Chrome"],
      unit: "pcs",
    },
    Plywood: {
      types: ["MR", "BWR", "BWP", "Marine"],
      unit: "sq.ft",
    },
    MDF: {
      types: ["6 mm", "12 mm", "18 mm", "25 mm"],
      unit: "sq.ft",
    },
    HDF: {
      types: ["6 mm", "12 mm", "18 mm"],
      unit: "sq.ft",
    },
    Laminate: {
      types: ["0.8 mm", "1.0 mm", "1.2 mm"],
      unit: "sheet",
    },
    "Edge Band": {
      types: ["PVC", "ABS", "Acrylic"],
      unit: "m",
    },
    Hinges: {
      types: ["Regular", "Soft Close", "Hydraulic", "90 Degree"],
      unit: "pcs",
    },
    "Drawer Channels": {
      types: ["Normal", "Telescopic", "Soft Close", "Under Mount"],
      unit: "set",
    },
    Handles: {
      types: ["Aluminium", "SS", "Brass", "Profile Handle"],
      unit: "pcs",
    },
    Screws: {
      types: ["1 inch", "1.5 inch", "2 inch", "2.5 inch", "3 inch"],
      unit: "box",
    },
    "Cabinet Legs": {
      types: ["PVC", "SS", "Adjustable"],
      unit: "pcs",
    },
    Chimney: {
      types: ["60 cm", "90 cm", "Auto Clean", "Filterless"],
      unit: "pcs",
    },
    Hob: {
      types: ["2 Burner", "3 Burner", "4 Burner", "5 Burner"],
      unit: "pcs",
    },
    RO: {
      types: ["RO", "RO+UV", "RO+UV+UF", "RO+Mineral"],
      unit: "pcs",
    },
    Dishwasher: {
      types: ["Freestanding", "Built-in", "Fully Automatic"],
      unit: "pcs",
    },
  },

  "Doors & Windows": {
    "Main Door": {
      types: ["Wooden", "Flush", "WPC", "Laminate", "Designer"],
      unit: "pcs",
    },
    "Internal Doors": {
      types: ["Flush", "Laminate", "PVC", "WPC"],
      unit: "pcs",
    },
    "Door Frames": {
      types: ["Wood", "WPC", "PVC", "Steel"],
      unit: "pcs",
    },
    Hinges: {
      types: ["SS", "Brass", "Heavy Duty", "Ball Bearing"],
      unit: "pcs",
    },
    Handles: {
      types: ["Lever", "Pull Handle", "Mortise Handle", "SS"],
      unit: "pcs",
    },
    Locks: {
      types: ["Mortise", "Cylindrical", "Deadbolt", "Digital"],
      unit: "pcs",
    },
    "Tower Bolts": {
      types: ["4 inch", "6 inch", "8 inch", "10 inch"],
      unit: "pcs",
    },
    "Door Stoppers": {
      types: ["Floor", "Wall", "Magnetic"],
      unit: "pcs",
    },
    "Door Closers": {
      types: ["Hydraulic", "Concealed", "Heavy Duty"],
      unit: "pcs",
    },
    Screws: {
      types: ["1 inch", "1.5 inch", "2 inch", "2.5 inch", "3 inch"],
      unit: "box",
    },
    "Aluminium Windows": {
      types: ["Sliding", "Casement", "Fixed", "Openable"],
      unit: "sq.ft",
    },
    "UPVC Windows": {
      types: ["Sliding", "Casement", "Fixed", "Openable"],
      unit: "sq.ft",
    },
    Glass: {
      types: ["Clear", "Toughened", "Laminated", "Frosted", "Tinted"],
      unit: "sq.ft",
    },
    "Mosquito Mesh": {
      types: ["Fiberglass", "SS Mesh", "Aluminium Mesh"],
      unit: "sq.ft",
    },
    "Window Handles": {
      types: ["PVC", "Aluminium", "SS"],
      unit: "pcs",
    },
    Rollers: {
      types: ["Sliding Roller", "Heavy Duty Roller", "Window Roller"],
      unit: "pcs",
    },
    Silicone: {
      types: ["Clear", "White", "Weatherproof", "Structural"],
      unit: "tube",
    },
    "Window Locks": {
      types: ["Sliding Lock", "Casement Lock", "Multipoint Lock"],
      unit: "pcs",
    },
  },

  Painting: {
    "Wall Putty": {
      types: ["Cement Based", "Acrylic", "Premium"],
      unit: "kg",
    },
    Primer: {
      types: ["Interior", "Exterior", "Alkali Resistant", "Wall Primer"],
      unit: "litre",
    },
    "Interior Paint": {
      types: ["Economy", "Premium", "Luxury", "Emulsion"],
      unit: "litre",
    },
    "Exterior Paint": {
      types: ["Weather Coat", "Exterior Emulsion", "Acrylic"],
      unit: "litre",
    },
    "Ceiling Paint": {
      types: ["Matt", "White Emulsion", "Premium Ceiling"],
      unit: "litre",
    },
    "Enamel Paint": {
      types: ["Synthetic", "Water Based", "PU"],
      unit: "litre",
    },
    "Wood Polish": {
      types: ["Melamine", "PU", "French Polish", "Water Based"],
      unit: "litre",
    },
    Thinner: {
      types: ["NC Thinner", "PU Thinner", "General Purpose"],
      unit: "litre",
    },
    Sandpaper: {
      types: ["80 Grit", "120 Grit", "180 Grit", "220 Grit", "320 Grit"],
      unit: "pcs",
    },
    "Paint Brushes": {
      types: ["1 inch", "2 inch", "3 inch", "4 inch"],
      unit: "pcs",
    },
    Rollers: {
      types: ["4 inch", "7 inch", "9 inch", "12 inch"],
      unit: "pcs",
    },
    "Roller Handles": {
      types: ["4 inch", "7 inch", "9 inch", "12 inch"],
      unit: "pcs",
    },
    "Paint Trays": {
      types: ["Small", "Medium", "Large"],
      unit: "pcs",
    },
    "Masking Tape": {
      types: ["1 inch", "2 inch", "3 inch"],
      unit: "roll",
    },
    "Plastic Sheets": {
      types: ["100 micron", "150 micron", "200 micron"],
      unit: "sq.ft",
    },
    Scrapers: {
      types: ["2 inch", "4 inch", "6 inch", "8 inch"],
      unit: "pcs",
    },
    "Crack Filler": {
      types: ["Acrylic", "Cement Based", "Flexible"],
      unit: "kg",
    },
    Sealant: {
      types: ["Acrylic", "Silicone", "PU"],
      unit: "tube",
    },
  },

  "False Ceiling & Gypsum": {
    "Gypsum Boards": {
      types: ["9 mm", "12.5 mm", "Fire Resistant", "Moisture Resistant"],
      unit: "sheet",
    },
    "GI Channels": {
      types: ["50 mm", "60 mm", "75 mm", "100 mm"],
      unit: "m",
    },
    "Ceiling Sections": {
      types: ["Ceiling Section", "Intermediate Section"],
      unit: "m",
    },
    "Perimeter Channels": {
      types: ["25 mm", "50 mm", "75 mm"],
      unit: "m",
    },
    Hangers: {
      types: ["Adjustable", "Wire Hanger", "Clip Hanger"],
      unit: "pcs",
    },
    Screws: {
      types: ["25 mm", "35 mm", "45 mm", "55 mm"],
      unit: "box",
    },
    "Joint Tape": {
      types: ["Paper Tape", "Fiberglass Tape", "Self Adhesive"],
      unit: "roll",
    },
    "Jointing Compound": {
      types: ["Ready Mix", "Powder"],
      unit: "kg",
    },
    "Access Panels": {
      types: ["300x300 mm", "450x450 mm", "600x600 mm"],
      unit: "pcs",
    },
    Insulation: {
      types: ["Rock Wool", "Glass Wool", "XPS", "Thermal Insulation"],
      unit: "sq.ft",
    },
    "LED Lights": {
      types: ["Downlight", "Panel", "Spotlight", "Strip Light"],
      unit: "pcs",
    },
  },

  Waterproofing: {
    "Waterproofing Chemical": {
      types: ["Cementitious", "Acrylic", "PU", "Integral"],
      unit: "kg",
    },
    Cement: {
      types: ["OPC 43", "OPC 53", "PPC"],
      unit: "bags",
    },
    Sand: {
      types: ["River Sand", "M-Sand", "Fine Sand"],
      unit: "cu.ft",
    },
    "Waterproofing Membrane": {
      types: ["APP", "SBS", "PVC", "HDPE"],
      unit: "sq.ft",
    },
    Primer: {
      types: ["Bitumen Primer", "PU Primer", "Acrylic Primer"],
      unit: "litre",
    },
    "Crack Sealant": {
      types: ["PU", "Acrylic", "Epoxy"],
      unit: "kg",
    },
    "Joint Sealant": {
      types: ["PU", "Silicone", "Polysulfide"],
      unit: "tube",
    },
    "Protection Screed": {
      types: ["Cement Sand Screed", "Ready Mix Screed"],
      unit: "sq.ft",
    },
    "Drainage Accessories": {
      types: ["Drain Cell", "Drain Board", "Floor Drain", "Outlet"],
      unit: "pcs",
    },
  },

  "Hardware & Miscellaneous": {
    Nails: {
      types: ["1 inch", "1.5 inch", "2 inch", "2.5 inch", "3 inch", "4 inch"],
      unit: "kg",
    },
    Screws: {
      types: ["1 inch", "1.5 inch", "2 inch", "2.5 inch", "3 inch", "4 inch"],
      unit: "box",
    },
    "Wall Plugs": {
      types: ["6 mm", "8 mm", "10 mm", "12 mm"],
      unit: "pcs",
    },
    Anchors: {
      types: ["Plastic Anchor", "Expansion Anchor", "Chemical Anchor"],
      unit: "pcs",
    },
    "Rawl Plugs": {
      types: ["6 mm", "8 mm", "10 mm", "12 mm"],
      unit: "pcs",
    },
    Washers: {
      types: ["MS", "SS", "Flat", "Spring"],
      unit: "pcs",
    },
    Nuts: {
      types: ["M6", "M8", "M10", "M12", "M16"],
      unit: "pcs",
    },
    Bolts: {
      types: ["M6", "M8", "M10", "M12", "M16"],
      unit: "pcs",
    },
    Tapes: {
      types: [
        "Duct Tape",
        "Masking Tape",
        "Electrical Tape",
        "Double Sided",
      ],
      unit: "roll",
    },
    Adhesives: {
      types: [
        "Construction Adhesive",
        "Epoxy",
        "PU",
        "Contact Adhesive",
      ],
      unit: "kg",
    },
    Silicone: {
      types: ["Clear", "White", "Black", "Sanitary"],
      unit: "tube",
    },
    Sealants: {
      types: ["Acrylic", "PU", "Silicone", "Polysulfide"],
      unit: "tube",
    },
    "Fevicol / Wood Adhesive": {
      types: ["Regular", "Marine", "Fast Setting"],
      unit: "kg",
    },
    Epoxy: {
      types: ["Clear", "Structural", "Flooring", "Repair"],
      unit: "kg",
    },
    "Cutting Discs": {
      types: ["4 inch", "5 inch", "7 inch", "14 inch"],
      unit: "pcs",
    },
    "Drill Bits": {
      types: ["4 mm", "6 mm", "8 mm", "10 mm", "12 mm", "16 mm"],
      unit: "pcs",
    },
    Sandpaper: {
      types: ["80 Grit", "120 Grit", "180 Grit", "220 Grit", "320 Grit"],
      unit: "pcs",
    },
    "Cleaning Chemicals": {
      types: [
        "Tile Cleaner",
        "Cement Cleaner",
        "Glass Cleaner",
        "Floor Cleaner",
      ],
      unit: "litre",
    },
    "Protective Sheets": {
      types: ["Plastic Sheet", "Floor Protection Sheet", "Foam Sheet"],
      unit: "sq.ft",
    },
    "Garbage Bags": {
      types: ["Small", "Medium", "Large", "Heavy Duty"],
      unit: "pcs",
    },
    Gloves: {
      types: ["Cotton", "Rubber", "Nitrile", "Cut Resistant"],
      unit: "pair",
    },
    Masks: {
      types: ["Dust Mask", "N95", "Respirator"],
      unit: "pcs",
    },
  },
};

function ShoppingList({ onBack, onBOQ }) {
  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [customType, setCustomType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");

  const [shoppingItems, setShoppingItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  const categories = useMemo(
    () => Object.keys(SHOPPING_DATABASE),
    []
  );

  const itemNames = useMemo(
    () =>
      category
        ? Object.keys(SHOPPING_DATABASE[category] || {})
        : [],
    [category]
  );

  const availableTypes = useMemo(
    () =>
      category && item
        ? SHOPPING_DATABASE[category]?.[item]?.types || []
        : [],
    [category, item]
  );

  const effectiveType =
    type === "Custom" ? customType.trim() : type;

  const itemTotal =
    (Number(quantity) || 0) * (Number(price) || 0);

  const grandTotal = shoppingItems.reduce(
    (sum, currentItem) =>
      sum +
      (Number(currentItem.quantity) || 0) *
        (Number(currentItem.price) || 0),
    0
  );

  const resetForm = () => {
    setCategory("");
    setItem("");
    setType("");
    setCustomType("");
    setQuantity("");
    setUnit("");
    setPrice("");
    setEditingId(null);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setItem("");
    setType("");
    setCustomType("");
    setUnit("");
  };

  const handleItemChange = (value) => {
    setItem(value);
    setType("");
    setCustomType("");

    const selectedItem =
      SHOPPING_DATABASE[category]?.[value];

    if (selectedItem?.unit) {
      setUnit(selectedItem.unit);
    } else {
      setUnit("");
    }
  };

  const handleAddItem = () => {
    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!item) {
      alert("Please select a material / item.");
      return;
    }

    if (!effectiveType) {
      alert("Please select or enter a type / specification.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!unit) {
      alert("Please select a unit.");
      return;
    }

    if (price === "" || Number(price) < 0) {
      alert("Please enter a valid price.");
      return;
    }

    const newItem = {
      id: editingId || Date.now(),
      category,
      item,
      type: effectiveType,
      quantity: Number(quantity),
      unit,
      price: Number(price),
    };

    if (editingId) {
      setShoppingItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === editingId
            ? newItem
            : currentItem
        )
      );
    } else {
      setShoppingItems((currentItems) => [
        ...currentItems,
        newItem,
      ]);
    }

    resetForm();
  };

  const handleEdit = (shoppingItem) => {
    setEditingId(shoppingItem.id);
    setCategory(shoppingItem.category);
    setItem(shoppingItem.item);

    const savedType = shoppingItem.type || "";
    const currentTypes =
      SHOPPING_DATABASE[shoppingItem.category]?.[
        shoppingItem.item
      ]?.types || [];

    if (currentTypes.includes(savedType)) {
      setType(savedType);
      setCustomType("");
    } else {
      setType("Custom");
      setCustomType(savedType);
    }

    setQuantity(String(shoppingItem.quantity));
    setUnit(shoppingItem.unit);
    setPrice(String(shoppingItem.price));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    setShoppingItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  };

  const handleClearAll = () => {
    if (shoppingItems.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear the complete shopping list?"
    );

    if (confirmed) {
      setShoppingItems([]);
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-blue-800">
                Renovate<span className="text-slate-800">Calc</span>
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Renovation Shopping List
              </p>
            </div>

          </div>
        </div>
      </header>

      <main className="bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50/50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Page heading */}
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Renovation Planning
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Shopping List
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Add all materials, accessories, specifications,
              quantities and prices required for your renovation
              project.
            </p>
          </div>

          {/* Add Item Form */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/[0.06]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">
                  {editingId
                    ? "Edit Shopping Item"
                    : "Add Shopping Item"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select from the complete renovation material
                  and accessory database.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    handleCategoryChange(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((currentCategory) => (
                    <option
                      key={currentCategory}
                      value={currentCategory}
                    >
                      {currentCategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Material / Item
                </label>

                <select
                  value={item}
                  onChange={(event) =>
                    handleItemChange(event.target.value)
                  }
                  disabled={!category}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {category
                      ? "Select Material / Item"
                      : "Select Category First"}
                  </option>

                  {itemNames.map((itemName) => (
                    <option key={itemName} value={itemName}>
                      {itemName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Type / Size / Specification
                </label>

                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value)
                  }
                  disabled={!item}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {item
                      ? "Select Type / Specification"
                      : "Select Material First"}
                  </option>

                  {availableTypes.map((availableType) => (
                    <option
                      key={availableType}
                      value={availableType}
                    >
                      {availableType}
                    </option>
                  ))}

                  <option value="Custom">
                    Custom / Other
                  </option>
                </select>
              </div>

              {/* Custom Type */}
              {type === "Custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Custom Type / Specification
                  </label>

                  <input
                    type="text"
                    value={customType}
                    onChange={(event) =>
                      setCustomType(event.target.value)
                    }
                    placeholder="Enter custom specification"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  placeholder="Enter quantity"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Unit
                </label>

                <select
                  value={unit}
                  onChange={(event) =>
                    setUnit(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">
                    Select Unit
                  </option>

                  {UNITS.map((currentUnit) => (
                    <option
                      key={currentUnit}
                      value={currentUnit}
                    >
                      {currentUnit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Price / Unit
                </label>

                <input
                  type="number"
                  min="0"
                  step="any"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="₹ Enter price"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Item Total */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Item Total
                </label>

                <div className="flex min-h-[48px] items-center rounded-lg border border-blue-100 bg-blue-50 px-4 text-lg font-extrabold text-blue-800">
                  {formatCurrency(itemTotal)}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center justify-center rounded-lg bg-blue-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                {editingId
                  ? "Update Item"
                  : "+ Add to Shopping List"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </section>

          {/* Shopping List */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/[0.06]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">
                  Your Shopping List
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  All selected materials and accessories for
                  the project.
                </p>
              </div>

              {shoppingItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Clear All
                </button>
              )}
            </div>

            {shoppingItems.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div className="text-4xl">🛒</div>

                <h4 className="mt-3 text-lg font-bold text-slate-800">
                  Shopping list is empty
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Add materials and accessories using the form
                  above.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="mt-6 hidden overflow-x-auto lg:block">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr>
                        <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Category
                        </th>

                        <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Item
                        </th>

                        <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Type / Specification
                        </th>

                        <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                          Qty
                        </th>

                        <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Unit
                        </th>

                        <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                          Price
                        </th>

                        <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                          Total
                        </th>

                        <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {shoppingItems.map((shoppingItem) => {
                        const rowTotal =
                          (Number(shoppingItem.quantity) || 0) *
                          (Number(shoppingItem.price) || 0);

                        return (
                          <tr key={shoppingItem.id}>
                            <td className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-700">
                              {shoppingItem.category}
                            </td>

                            <td className="border-b border-slate-100 px-4 py-4 text-sm font-bold text-slate-900">
                              {shoppingItem.item}
                            </td>

                            <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                              {shoppingItem.type}
                            </td>

                            <td className="border-b border-slate-100 px-4 py-4 text-right text-sm font-semibold text-slate-800">
                              {shoppingItem.quantity}
                            </td>

                            <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                              {shoppingItem.unit}
                            </td>

                            <td className="border-b border-slate-100 px-4 py-4 text-right text-sm text-slate-700">
                              {formatCurrency(shoppingItem.price)}
                            </td>

                            <td className="border-b border-slate-100 px-4 py-4 text-right text-sm font-bold text-blue-800">
                              {formatCurrency(rowTotal)}
                            </td>

                            <td className="border-b border-slate-100 px-4 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(shoppingItem)
                                  }
                                  className="rounded-md border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(shoppingItem.id)
                                  }
                                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    <tfoot>
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-5 text-right text-sm font-bold text-slate-700"
                        >
                          Grand Total
                        </td>

                        <td className="px-4 py-5 text-right text-lg font-extrabold text-blue-800">
                          {formatCurrency(grandTotal)}
                        </td>

                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="mt-6 space-y-4 lg:hidden">
                  {shoppingItems.map((shoppingItem) => {
                    const rowTotal =
                      (Number(shoppingItem.quantity) || 0) *
                      (Number(shoppingItem.price) || 0);

                    return (
                      <div
                        key={shoppingItem.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                              {shoppingItem.category}
                            </p>

                            <h4 className="mt-1 font-extrabold text-slate-950">
                              {shoppingItem.item}
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                              {shoppingItem.type}
                            </p>
                          </div>

                          <p className="text-right text-base font-extrabold text-blue-800">
                            {formatCurrency(rowTotal)}
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-lg bg-white p-3">
                            <p className="text-xs text-slate-500">
                              Quantity
                            </p>

                            <p className="mt-1 font-bold text-slate-800">
                              {shoppingItem.quantity}{" "}
                              {shoppingItem.unit}
                            </p>
                          </div>

                          <div className="rounded-lg bg-white p-3">
                            <p className="text-xs text-slate-500">
                              Price / Unit
                            </p>

                            <p className="mt-1 font-bold text-slate-800">
                              {formatCurrency(
                                shoppingItem.price
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(shoppingItem)
                            }
                            className="flex-1 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(shoppingItem.id)
                            }
                            className="flex-1 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900">
                        Grand Total
                      </span>

                      <span className="text-xl font-extrabold text-blue-800">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* BOQ */}
            {shoppingItems.length > 0 && onBOQ && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => onBOQ(shoppingItems)}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  📋 Generate BOQ & Estimate
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-blue-950 px-6 py-10 text-center text-blue-100">
        <p className="text-xl font-bold">
          Renovate<span className="text-white">Calc</span>
        </p>

        <p className="mt-2 text-sm text-blue-200">
          Smart renovation material estimation.
        </p>
      </footer>
    </div>
  );
}

export default ShoppingList;
