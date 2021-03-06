var BLOCK_TYPE_LOG = Block.createSpecialType({
	base: 17
});

var BLOCK_TYPE_LEAVES = Block.createSpecialType({
	base: 18
});


IDRegistry.genBlockID("rubberTreeLog");
Block.createBlock("rubberTreeLog", [
	{name: "tile.rubberTreeLog.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false}
], BLOCK_TYPE_LOG);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLog, "wood");

IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlock("rubberTreeLogLatex", [
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 2], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 2], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 2], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 2]], inCreative: false}
], BLOCK_TYPE_LOG);
Block.registerDropFunction("rubberTreeLogLatex", function(){
	return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLogLatex, "wood");

IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
	{name: "tile.rubberTreeLeaves.name", texture: [["rubber_tree_leaves", 0]], inCreative: false}
], BLOCK_TYPE_LEAVES);
Block.registerDropFunction("rubberTreeLeaves", function(){
	if (Math.random() < .075){
		return [[ItemID.rubberSapling, 1, 0]]
	}
	else {
		return [];
	}
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");



var RubberTreeGenerationHelper = {
	/*
	 params: {
		 leaves: {
			 id: 
			 data: 
		 },
		 log: {
			 id: 
			 data:
			 resin: 
		 },
		 height: {
			 min:
			 max:
			 start: 
		 },
		 pike:
		 radius: 
	 }
	*/
	generateCustomTree: function(x, y, z, params){
		var leaves = params.leaves;
		var log = params.log;
		
		var height = parseInt(Math.random() * (.5 + params.height.max - params.height.min) + params.height.min);
		var resinHeight = -1;
		if (log.resin){
			resinHeight = parseInt(Math.random() * (height - 2)) + 1;
		}
		for (var ys = 0; ys < height; ys++){
			if (ys == resinHeight){
				World.setBlock(x, y + ys, z, log.resin, parseInt(Math.random() * 4));
			}
			else{
				World.setFullBlock(x, y + ys, z, log);
			}
		}
		
		GenerationUtils.lockInBlock(leaves.id, leaves.data);
		if (params.pike){
			for (var ys = 0; ys < params.pike; ys++){
				GenerationUtils.setLockedBlock(x, y + ys + height, z);
			}
		}
		
		var leavesStart = params.height.start;
		var leavesEnd = height;
		var leavesMiddle = (leavesEnd + leavesStart) / 2;
		var leavesLen = leavesEnd - leavesStart;
		for (var ys = leavesStart; ys < leavesEnd; ys++){
			for (var xs = -params.radius; xs <= params.radius; xs++){
				for (var zs = -params.radius; zs <= params.radius; zs++){
					var d = Math.sqrt(xs * xs + zs * zs) + (Math.random() * .5 + .5) * Math.pow(Math.abs(leavesMiddle - ys) / leavesLen, 1.5) * 1.2;
					if (d <= params.radius + .5 && nativeGetTile(x + xs, y + ys, z + zs) == 0){
						GenerationUtils.setLockedBlock(x + xs, y + ys, z + zs);
					}
				}	
			}
		}
	},
	
	generateRubberTree: function(x, y, z, activateTileEntity){
		RubberTreeGenerationHelper.generateCustomTree(x, y, z, {
			log: {
				id: BlockID.rubberTreeLog,
				data: 0,
				resin: BlockID.rubberTreeLogLatex
			},
			leaves: {
				id: BlockID.rubberTreeLeaves,
				data: 0
			},
			height: {
				min: 5,
				max: 7,
				start: 2 + parseInt(Math.random() * 2)
			},
			pike: 2 + parseInt(Math.random() * 1.5),
			radius: 2
		});
		if (activateTileEntity){
			return World.addTileEntity(x, y, z);
		}
	}
}


var DesertBiomeIDs = {2:true, 17:true};
var ForestBiomeIDs = {4:true, 18:true, 27:true, 28:true, 29:true};
var JungleBiomeIDs = {21:true};
var SwampBiomeIDs = {6:true};

var RUBBER_TREE_BIOME_DATA = {
	4: .5,
	18: .5,
	27: .5,
	28: .5,
	29: .5,
	21: .8,
	6: 1
};

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
	if (Math.random() < .08){
		if(Math.random() < RUBBER_TREE_BIOME_DATA[World.getBiome((chunkX + .5) * 16, (chunkZ + .5) * 16)] || .1){
			for (var i = 0; i < 1 + Math.random() * 2; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 64, 128);
				coords = GenerationUtils.findSurface(coords.x, coords.y, coords.z);
				if (World.getBlockID(coords.x, coords.y, coords.z) == 2){	
					coords.y++;	
					RubberTreeGenerationHelper.generateRubberTree(coords.x, coords.y, coords.z, false);
				}
			}
		}
	}
});

