IDRegistry.genBlockID("geothermalGenerator");
Block.createBlockWithRotation("geothermalGenerator", [
	{name: "Geothermal Generator", texture: [["machine_bottom", 1], ["machine_top", 1], ["machine_side", 1], ["geothermal_generator_side", 1], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.geothermalGenerator, count: 1, data: 0}, [
		"axa",
		"axa",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'a', ItemID.fluidCellEmpty, 0, 'b', ItemID.ingotSteel, -1, 'x', 102, 0]);
});

var guiGeothermalGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Geothermal Generator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		//{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "geotermal_liquid_slot", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		//"energyScale": {type: "scale", x: 530, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"liquidScale": {type: "scale", x: 450 + GUI_BAR_STANDART_SCALE, y: 150 + GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "geotermal_empty_liquid_slot", overlay: "geotermal_liquid_slot_overlay", overlayOffset: {x: -GUI_BAR_STANDART_SCALE, y: -GUI_BAR_STANDART_SCALE}, scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 542, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 542, y: 172, width: 300, height: 30, text: "16000 mB"}
	}
});




MachineRegistry.registerPrototype(BlockID.geothermalGenerator, {
	defaultValues: {
		burn: 0,
		burnMax: 0
	},
	
	getGuiScreen: function(){
		return guiGeothermalGenerator;
	},
	
	init: function(){
		this.liquidStorage.setLimit("lava", 16);
		
	},
	
	tick: function(){
		this.liquidStorage.updateUiScale("liquidScale", "lava");
		
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		var empty = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
		if (empty && empty.liquid == "lava"){
			if (this.liquidStorage.getAmount("lava") <= 15 && (slot2.id == empty.id && slot2.data == empty.data && slot2.count < Item.getMaxStack(empty.id) || slot2.id == 0)){
				this.liquidStorage.addLiquid("lava", 1);
				slot1.count--;
				slot2.id = empty.id;
				slot2.data = empty.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		
		this.container.setText("textInfo1", parseInt(this.liquidStorage.getAmount("lava") * 1000) + "/");
	},
	
	
	energyTick: function(){
		if (this.liquidStorage.getLiquid("lava", 0.001) > 0){
			if (this.web.addEnergy(20) > 0){
				this.liquidStorage.addLiquid("lava", 0.001);
			}
		}
	}
	
});