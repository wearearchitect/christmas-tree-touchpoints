// Modular JS file
XMAS_TREE = (function () {

	// Breakpoints
	// Useful variables (for size and position)
	var	canvas = null,
		c = null, // init the context variable

		days = DAYS,
		branches = DAYS + 2,

		start = {
			left: UTILS.winW / 2,
			top: 30
		},

		hTop = 125, // Top section of the tree
		hMiddle = 65 * branches, // Middle section of branches
		hBottom = 60 + (2*branches), // bottom section of the tree

		init = function () {
			// Create the canvas and add to page
			canvas = document.createElement('canvas');
			canvas.setAttribute('id', 'tree-canvas');
			document.getElementById('xmas-tree').appendChild(canvas);
			document.getElementById('tree-fallback').style.display = 'none';

			SETTINGS.main.width = UTILS.winW;
			SETTINGS.main.height = start.top + hTop + hMiddle + hBottom + RENDER.trunkHeight + 60; // + 60 for presents - keeps the background in a good place

			canvas.width = SETTINGS.main.width;
			// Add ALL THE THINGS
			canvas.height = SETTINGS.main.height;

			document.getElementById('xmas-tree').style.height = SETTINGS.main.height + 'px';

			// Get the canvas Context to draw to
			c = canvas.getContext('2d');

			UTILS.loadImages(RENDER.images, buildTree);

			var presTop = hTop + hMiddle + 60;

			canvas.style.backgroundPosition = '50% ' + presTop + 'px';
		},

		reset = function() {
			canvas.parentNode.removeChild(canvas);
			document.getElementById('tree-fallback').style.display = 'block';

			canvas.onclick = null;
			document.removeEventListener('mousemove', INTERACTIONS.hover, false);
		},

		buildTree = function(filtering) {

			if( filtering ) {
				c.clearRect(0, 0, canvas.width, canvas.height);

				canvas.onclick = null;
				document.removeEventListener('mousemove', INTERACTIONS.hover, false);
			} else {
				ANIMATIONS.snow();
			}

			RENDER.trunk(c, branches);
			RENDER.tree(c, false); // Right side
			RENDER.tree(c, true); // Left side

			// highlightBranches();

			RENDER.leaves(c, branches);
			RENDER.decs(c);

			// No need for static snow now there's falling snow
			// RENDER.snow(c);

			CONTENT.go();
		},

		setupDays = function(days, itemsArray) {

			var items = [],
				ribbonBranch = branches + 1,
				rows = 1;

			for( var i=0; i<days; i++ ) {
				var branch = ribbonBranch - i,
					day = i + 1;

				if( i >= (days - 2) ) {
					--branch;
					--ribbonBranch;
					rows = 2;
				}

				items = itemsArray[i];

				RENDER.ribbon(c, day, branch);
				RENDER.items(c, branch, day, items, rows);
			}

			/** Comment out for prod
			if( Modernizr.pointerevents ) {
				ANIMATIONS.twinkles();
			}
			**/

			canvas.onclick = INTERACTIONS.clickHandler;
			document.addEventListener('mousemove', INTERACTIONS.hover, false);
		};

	return {
		go : init,
		reset : reset,
		setupDays : setupDays,
		build : buildTree,

		days : days,
		branches : branches,

		treeTop : hTop,
		treeMiddle : hMiddle,
		treeBottom : hBottom,

		start : start
	};

})();

ssm.addState({
	id: 'desktop',
	minWidth: 992,
	onEnter: function() {
		XMAS_TREE.go();
	},
	onLeave: function () {
		XMAS_TREE.reset();
		CONTENT.reset();
	}
}).ready();
