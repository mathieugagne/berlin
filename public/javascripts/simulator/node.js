/**
 * author: Guillaume Malette <gmalette@gmail.com> @gmalette
 * author: Christian Blais <christ.blais@gmail.com> @christianblais
 * author: Jodi Giordano <giordano.jodi@gmail.com> @jodi
 * website: thirdside.ca
 * date: 12/04/2011
 */

/*
 * A general node
 */
 TS.Node = Class.create(TS, {
	initialize: function ($super, id, type, x, y)
	{
		$super();
		this.position	= {x: x, y: y};
		this.id			= id;
		this.type		= type;
		this.links		= new Array();
		this.playerId	= null;
		this.nbSoldiers	= 0;
		this.players    = {}; //for combats
	},
	
	linkTo: function (otherNode, controlRatio)
	{
		this.links.push({
			'toId': otherNode.id,
			'controlRatio': controlRatio ? controlRatio : ((Math.random() * 30 | 0) / 100)
		});
	},
	
	getLink: function (toId)
	{
		for(var i = 0; i < this.links.length; i++)
			if (this.links[i].toId == toId)
				return this.links[i];
		
		return null;
	},
	
	setSoldiers: function(playerId, nbSoldiers)
	{
		this.playerId = playerId,
		this.nbSoldiers = nbSoldiers;
	}
});

/*
 * A city node
 */
TS.City = Class.create(TS.Node, {
	initialize: function ($super, id, x, y)
	{
		$super(id, 'city', x, y);
		this.layout = (Math.random() * 3) | 0;
	},
});

/*
 * The graph holding all the nodes and related infos.
 */
TS.NodeGraph = Class.create(TS, {
	initialize: function ($super, map)
	{
		$super();
		this.nodes 		= {};
		this.map 		= map;
		this.directed 	= map.infos.directed || false;
		
		// Create nodes
		this.map.nodes.each(function(node){
			if (node.type == 'city')
				this.nodes[node.id] = new TS.City(node.id, node.x, node.y);
			else
				this.nodes[node.id] = new TS.Node(node.id, node.type, node.x, node.y);
		}, this);
		
		// Add paths between the nodes
		this.map.paths.each(function(path){
			this.nodes[path.from].linkTo(this.nodes[path.to], path.control_ratio);
		}, this);
	},
	
	/*
	 * Sync nodes objects with moves data to determine:
	 * - if a node is in combat (X vs X vs ...)
	 * - if a node is captured (One player on it at this turn)
	 * - if a player is sacrifying soldiers (the attacker(s) are outnumbered)
	 * - the winner of a combat
	 * - the looser(s) of a combat
	 * - if a combat is a draw
	 * - if a node is reinforced (only one moving player & moving player == owner)
	 * - a race occurs for a node (there no one on the node and two or more players try to capture it)
	 * - etc. 
	 */
	syncCombats: function (moves)
	{
		// reset the players on the node
		Object.keys(this.nodes).each(function(nodeKey) {
			this.nodes[nodeKey].players = {};
		}, this);
		
		// sync the players on the node
		moves.each(function(data) {
			this.nodes[data.to].players[data.player_id] = data.number_of_soldiers;
		}, this);
		
		// - decrement the number of soldiers on the 'from' node
		// - increment the number of soldiers on the 'to' node (if same player)
		moves.each(function(data) {
			this.nodes[data.from].nbSoldiers -= data.number_of_soldiers;
			
			if (this.nodes[data.to].playerId == this.nodes[data.from].playerId)
				this.nodes[data.to].nbSoldiers += data.number_of_soldiers;
		}, this);		
	},
	
	syncStates: function (states)
	{
		states.each(function(data) {
			this.nodes[data.node_id].setSoldiers(data.player_id, data.number_of_soldiers);
		}, this);
	},
	
	getNodeCaptured: function(id) {
		var node = this.nodes[id];
		var playersIds = Object.keys(node.players);
		
		return (playersIds.size() == 1) &&
		       (node.playerId == null ||
			       (node.players[playersIds[0]] != node.playerId && node.nbSoldiers == 0));
	},
	
	getNodeReinforced: function(id) {
		var node = this.nodes[id];
		var playersIds = Object.keys(node.players);
		
		return (playersIds.size() == 1) && (node.playerId == playersIds[0]);	
	},
	
	getNodeSuicide: function(id) {
		var node = this.nodes[id];
		var playersIds = Object.keys(node.players);

		var suicide = true;
		
		playersIds.each(function (playerId) {
			var soldiers = node.players[playerId];
			
			if (soldiers > node.nbSoldiers)
				suicide = false;
		}, this);
		
		return suicide;		
	},
	
	getPlayers: function(id) {
		return this.nodes[id].players;
	}
});