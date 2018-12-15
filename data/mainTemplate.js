module.exports = `
	<!DOCTYPE html>
	<html lang="en" class="no-js" manifest="webclip.appcache">
		<head>
			<meta charset="UTF-8" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title>{COMPANY NAME} Office Map</title>
			<link rel="stylesheet" type="text/css" href="css/normalize.css" />
			<link rel="stylesheet" type="text/css" href="css/style.css" />
			<link rel="apple-touch-icon" href="img/map-icon.png">
			<script src="js/modernizr-custom.js"></script>
			{ANALYTICS}
		</head>
		<body>
			<svg class="hidden">
				<defs>
					<symbol id="icon-pin" viewBox="0 0 200 300">
						<title>pin</title>
						<path d="M100,21.78A85,85,0,0,0,15.18,106.6c0,18.85,12.08,49.52,36.76,93.9,17.48,31.36,34.7,57.49,35.47,58.6L100,278.22l12.59-19.11c0.69-1.11,18-27.25,35.47-58.6,24.76-44.38,36.76-75.06,36.76-93.9A85,85,0,0,0,100,21.78Z" />
					</symbol>
					<symbol id="icon-search" viewBox="0 0 32 32">
						<title>search</title>
						<path class="path1" d="M26.819 24.917c0.262 0.262 0.262 0.688 0 0.951l-0.951 0.951c-0.263 0.262-0.688 0.262-0.951 0l-6.656-6.656c-0.072-0.072-0.12-0.158-0.153-0.248-1.365 0.998-3.041 1.593-4.862 1.593-4.562 0-8.261-3.699-8.261-8.261s3.699-8.261 8.261-8.261c4.562 0 8.261 3.699 8.261 8.261 0 1.821-0.595 3.497-1.593 4.862 0.091 0.032 0.176 0.080 0.248 0.153l6.656 6.656zM13.246 7.739c-3.041 0-5.508 2.466-5.508 5.508s2.466 5.508 5.508 5.508 5.508-2.466 5.508-5.508c0-3.041-2.466-5.508-5.508-5.508z"></path>
					</symbol>
					<symbol id="icon-stack" viewBox="0 0 32 32">
						<title>menu</title>
						<path class="path1" d="M29.143 11.071l-13.143-6.571-13.143 6.571 13.143 6.571 13.143-6.571zM16 6.681l8.781 4.39-8.781 4.39-8.781-4.39 8.781-4.39zM26.51 14.684l2.633 1.316-13.143 6.571-13.143-6.571 2.633-1.316 10.51 5.255zM26.51 19.612l2.633 1.316-13.143 6.571-13.143-6.571 2.633-1.316 10.51 5.255z"></path>
					</symbol>
					<symbol id="icon-angle-up" viewBox="0 0 21 32">
						<title>arrow-up</title>
						<path class="path1" d="M19.196 21.143q0 0.232-0.179 0.411l-0.893 0.893q-0.179 0.179-0.411 0.179t-0.411-0.179l-7.018-7.018-7.018 7.018q-0.179 0.179-0.411 0.179t-0.411-0.179l-0.893-0.893q-0.179-0.179-0.179-0.411t0.179-0.411l8.321-8.321q0.179-0.179 0.411-0.179t0.411 0.179l8.321 8.321q0.179 0.179 0.179 0.411z"></path>
					</symbol>
					<symbol id="icon-angle-down" viewBox="0 0 21 32">
						<title>arrow-down</title>
						<path class="path1" d="M19.196 13.143q0 0.232-0.179 0.411l-8.321 8.321q-0.179 0.179-0.411 0.179t-0.411-0.179l-8.321-8.321q-0.179-0.179-0.179-0.411t0.179-0.411l0.893-0.893q0.179-0.179 0.411-0.179t0.411 0.179l7.018 7.018 7.018-7.018q0.179-0.179 0.411-0.179t0.411 0.179l0.893 0.893q0.179 0.179 0.179 0.411z"></path>
					</symbol>
					<symbol id="icon-cross" viewBox="0 0 24 24">
						<title>close</title>
						<path class="path1" d="M18.016 5.125q0.369 0 0.614 0.245t0.245 0.614q0 0.363-0.248 0.611l-5.411 5.405 5.411 5.405q0.248 0.248 0.248 0.611 0 0.369-0.245 0.614t-0.614 0.245q-0.363 0-0.611-0.248l-5.405-5.411-5.405 5.411q-0.248 0.248-0.611 0.248-0.369 0-0.614-0.245t-0.245-0.614q0-0.363 0.248-0.611l5.411-5.405-5.411-5.405q-0.248-0.248-0.248-0.611 0-0.369 0.245-0.614t0.614-0.245q0.363 0 0.611 0.248l5.405 5.411 5.405-5.411q0.248-0.248 0.611-0.248z"></path>
					</symbol>
				</defs>
			</svg>
			<div class="container">
				<a class="test" href="/sync" target="_blank">Sync</a>
				<div class="main">
					{MAP}
					<!-- Navigation -->
					<button class="boxbutton boxbutton--dark open-search" title="Show search"><svg class="icon icon--search"><use xlink:href="#icon-search"></use></svg></button>
					<nav class="mallnav mallnav--hidden">
						<button class="boxbutton mallnav__button--up" title="Go up"><svg class="icon icon--angle-down"><use xlink:href="#icon-angle-up"></use></svg></button>
						<button class="boxbutton boxbutton--dark mallnav__button--all-levels" title="Back to all levels"><svg class="icon icon--stack"><use xlink:href="#icon-stack"></use></svg></button>
						<button class="boxbutton mallnav__button--down" title="Go down"><svg class="icon icon--angle-down"><use xlink:href="#icon-angle-down"></use></svg></button>
					</nav>
					<!-- Navigation -->

					<div class="content">
						<button class="boxbutton boxbutton--dark content__button content__button--hidden" title="Close details"><svg class="icon icon--cross"><use xlink:href="#icon-cross"></use></svg></button>
						{ITEMS}
					</div>
					<!-- content -->
				</div>
				<!-- /main -->
				<aside class="spaces-list" id="spaces-list">
					<div class="search">
						<input class="search__input" placeholder="Enter something..." />
						<button class="boxbutton boxbutton--darker close-search" title="Close details"><svg class="icon icon--cross"><use xlink:href="#icon-cross"></use></svg></button>
					</div>
					<span class="label">
						<input id="sort-by-name" class="label__checkbox" type="checkbox" title="Show alphabetically"/>
						<label for="sort-by-name" class="label__text"></label>
					</span>
					<ul class="list grouped-by-category">
						{LIST}
					</ul>
				</aside>
				<!-- /spaces-list -->
			</div>
			<!-- /container -->
			<script src="js/classie.js"></script>
			<script src="js/list.min.js"></script>
			<script src="js/main.js"></script>
		</body>
	</html>
`;
