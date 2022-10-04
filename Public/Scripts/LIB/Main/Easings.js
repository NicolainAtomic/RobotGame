//Easings
//Ref : https://github.com/tweenjs/tween.js/blob/master/src/Tween.js

//List of Easings :

// - Linear
// - QuadraticIn - QuadraticOut - QuadraticInOut
// - CubicIn - CubicOut - CubicInOut
// - QuarticIn - QuarticOut - QuarticInOut
// - QuinticIn - QuinticOut - QuinticInOut
// - QuinticIn - QuinticOut - QuinticInOut
// - SinusoidalIn - SinusoidalOut - SinusoidalInOut
// - ExponentialIn - ExponentialOut - ExponentialInOut
// - CircularIn - CircularOut - CircularInOut
// - ElasticIn - ElasticOut - ElasticInOut
// - BackIn - BackOut - BackInOut
// - BounceIn - BounceOut - BounceInOut


// Global Call
// Il suffit de copier coller la ligne en dessous en ajoutant "@" au début de la ligne.
//input int easingShow {"widget":"combobox","values":[{"label":"Linear","value":0},{"label":"QuadraticIn","value":1},{"label":"QuadraticOut","value":2},{"label":"QuadraticInOut","value":3},{"label":"CubicIn","value":4},{"label":"CubicOut","value":5},{"label":"CubicInOut","value":6},{"label":"QuarticIn","value":7},{"label":"QuarticOut","value":8},{"label":"QuarticInOut","value":9},{"label":"QuinticIn","value":10},{"label":"QuinticOut","value":11},{"label":"QuinticInOut","value":12},{"label":"SinusoidalIn","value":13},{"label":"SinusoidalOut","value":14},{"label":"SinusoidalInOut","value":15},{"label":"ExponentialIn","value":16},{"label":"ExponentialOut","value":17},{"label":"ExponentialInOut","value":18},{"label":"CircularIn","value":19},{"label":"CircularOut","value":20},{"label":"CircularInOut","value":21},{"label":"ElasticIn","value":22},{"label":"ElasticOut","value":23},{"label":"ElasticInOut","value":24},{"label":"BackIn","value":25},{"label":"BackOut","value":26},{"label":"BackInOut","value":27},{"label":"BounceIn","value":28},{"label":"BounceOut","value":29},{"label":"BounceInOut","value":30}]}



//////////////////////////////////////////
//				Linear
//////////////////////////////////////////
global.Linear = function (k)
{
	return k;
}


//////////////////////////////////////////
//				Quadratic
//////////////////////////////////////////
global.QuadraticIn = function (k)
{
	return k * k;
}

global.QuadraticOut = function (k)
{
	return k * (2 - k);
}

global.QuadraticInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return 0.5 * k * k;
	}
	return - 0.5 * (--k * (k - 2) - 1);
}


//////////////////////////////////////////
//				Cubic
//////////////////////////////////////////
global.CubicIn = function (k)
{
	return k * k * k;
}

global.CubicOut = function (k)
{
	return --k * k * k + 1;
}

global.CubicInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return 0.5 * k * k * k;
	}
	return 0.5 * ((k -= 2) * k * k + 2);
}


//////////////////////////////////////////
//				Quartic
//////////////////////////////////////////
global.QuarticIn = function (k)
{
	return k * k * k * k;
}

global.QuarticOut = function (k)
{
	return 1 - (--k * k * k * k);
}

global.QuarticInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return 0.5 * k * k * k * k;
	}
	return - 0.5 * ((k -= 2) * k * k * k - 2);
}


//////////////////////////////////////////
//				Quintic
//////////////////////////////////////////
global.QuinticIn = function (k)
{
	return k * k * k * k * k;
}

global.QuinticOut = function (k)
{
	return --k * k * k * k * k + 1;
}

global.QuinticInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return 0.5 * k * k * k * k * k;
	}
	return 0.5 * ((k -= 2) * k * k * k * k + 2);
}


//////////////////////////////////////////
//				Sinusoidal
//////////////////////////////////////////
global.SinusoidalIn = function (k)
{
	return 1 - Math.cos(k * Math.PI / 2);
}

global.SinusoidalOut = function (k)
{
	return Math.sin(k * Math.PI / 2);
}

global.SinusoidalInOut = function (k)
{
	return 0.5 * (1 - Math.cos(Math.PI * k));
}


//////////////////////////////////////////
//				Exponential
//////////////////////////////////////////
global.ExponentialIn = function (k)
{
	return k === 0 ? 0 : Math.pow(1024, k - 1);
}

global.ExponentialOut = function (k)
{
	return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);
}

global.ExponentialInOut = function (k)
{
	if (k === 0)
	{
		return 0;
	}
	if (k === 1)
	{
		return 1;
	}
	if ((k *= 2) < 1)
	{
		return 0.5 * Math.pow(1024, k - 1);
	}
	return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
}


//////////////////////////////////////////
//				Circular
//////////////////////////////////////////
global.CircularIn = function (k)
{
	return 1 - Math.sqrt(1 - k * k);
}

global.CircularOut = function (k)
{
	return Math.sqrt(1 - (--k * k));
}

global.CircularInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return - 0.5 * (Math.sqrt(1 - k * k) - 1);
	}
	return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
}


//////////////////////////////////////////
//				Elastic
//////////////////////////////////////////
global.ElasticIn = function (k)
{
	if (k === 0)
	{
		return 0;
	}
	if (k === 1)
	{
		return 1;
	}
	return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
}

global.ElasticOut = function (k)
{
	if (k === 0)
	{
		return 0;
	}
	if (k === 1)
	{
		return 1;
	}
	return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
}

global.ElasticInOut = function (k)
{
	if (k === 0)
	{
		return 0;
	}
	if (k === 1)
	{
		return 1;
	}

	k *= 2;

	if (k < 1)
	{
		return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
	}
	return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
}


//////////////////////////////////////////
//				Back
//////////////////////////////////////////
global.BackIn = function (k)
{
	var s = 1.70158;
	return k * k * ((s + 1) * k - s);
}

global.BackOut = function (k)
{
	var s = 1.70158;
	return --k * k * ((s + 1) * k + s) + 1;
}

global.BackInOut = function (k)
{
	var s = 1.70158 * 1.525;
	if ((k *= 2) < 1)
	{
		return 0.5 * (k * k * ((s + 1) * k - s));
	}
	return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
}


//////////////////////////////////////////
//				Bounce
//////////////////////////////////////////
global.BounceIn = function (k)
{
	return 1 - BounceOut(1 - k);
}

global.BounceOut = function (k)
{
	if (k < (1 / 2.75))
	{
		return 7.5625 * k * k;
	}
	else if (k < (2 / 2.75))
	{
		return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
	}
	else if (k < (2.5 / 2.75))
	{
		return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
	}
	else
	{
		return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
	}
}

global.BounceInOut = function (k)
{
	if (k < 0.5)
	{
		return BounceIn(k * 2) * 0.5;
	}
	return BounceOut(k * 2 - 1) * 0.5 + 0.5;
}



//////////////////////////////////////////
//				Cubic Bezier
//////////////////////////////////////////
global.CubicBezier = function (k, B, C)
{
	if (k === 0)
	{
		return 0;
	}
	else if (k === 1)
	{
		return 1;
	}
	else
	{
		var d = -k;
		var c = 3*B.x;
		var b = -6*B.x + 3*C.x;
		var a = 3*B.x - 3*C.x + 1;
	
		var root = getCorrectRoot(solveCubic(a, b, c, d));
	
		return B.y * (3 * Math.pow(1-root, 2) * root) + (C.y * (3 * (1-root) * root * root)) + (root * root * root);
	}
}


global.GetCubicBezierFunction = function (B, C)
{
	return function(k) { return global.CubicBezier(k, B, C); };
}


function cuberoot(x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
}


function solveCubic(a, b, c, d) {
    if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2+bx+c=0
        a = b; b = c; c = d;
        if (Math.abs(a) < 1e-8) { // Linear case, ax+b=0
            a = b; b = c;
            if (Math.abs(a) < 1e-8) // Degenerate case
                return [];
            return [-b/a];
        }

        var D = b*b - 4*a*c;
        if (Math.abs(D) < 1e-8)
            return [-b/(2*a)];
        else if (D > 0)
            return [(-b+Math.sqrt(D))/(2*a), (-b-Math.sqrt(D))/(2*a)];
        return [];
    }

    // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
    var p = (3*a*c - b*b)/(3*a*a);
    var q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
    var roots;

    if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
        roots = [cuberoot(-q)];
    } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
        roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
        var D = q*q/4 + p*p*p/27;
        if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
            roots = [-1.5*q/p, 3*q/p];
        } else if (D > 0) {             // Only one real root
            var u = cuberoot(-q/2 - Math.sqrt(D));
            roots = [u - p/(3*u)];
        } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
            var u = 2*Math.sqrt(-p/3);
            var t = Math.acos(3*q/p/u)/3;  // D < 0 implies p < 0 and acos argument in [-1..1]
            var k = 2*Math.PI/3;
            roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
        }
    }

    // Convert back from depressed cubic
    for (var i = 0; i < roots.length; i++)
        roots[i] -= b/(3*a);

    return roots;
}


function getCorrectRoot (roots)
{
	for (var i = 0; i < roots.length; ++i)
	{
		if (roots[i] >= 0 && roots[i] <= 1)
		{
			return roots[i];
		}
	}

	print("Error : root not found for CubicBezier, returning 0 instead !")
	return 0;
}


//////////////////////////////////////////
//				Global Call
//////////////////////////////////////////
//To use as an input : "@"
//input int easingShow {"widget":"combobox","values":[{"label":"Linear","value":0},{"label":"QuadraticIn","value":1},{"label":"QuadraticOut","value":2},{"label":"QuadraticInOut","value":3},{"label":"CubicIn","value":4},{"label":"CubicOut","value":5},{"label":"CubicInOut","value":6},{"label":"QuarticIn","value":7},{"label":"QuarticOut","value":8},{"label":"QuarticInOut","value":9},{"label":"QuinticIn","value":10},{"label":"QuinticOut","value":11},{"label":"QuinticInOut","value":12},{"label":"SinusoidalIn","value":13},{"label":"SinusoidalOut","value":14},{"label":"SinusoidalInOut","value":15},{"label":"ExponentialIn","value":16},{"label":"ExponentialOut","value":17},{"label":"ExponentialInOut","value":18},{"label":"CircularIn","value":19},{"label":"CircularOut","value":20},{"label":"CircularInOut","value":21},{"label":"ElasticIn","value":22},{"label":"ElasticOut","value":23},{"label":"ElasticInOut","value":24},{"label":"BackIn","value":25},{"label":"BackOut","value":26},{"label":"BackInOut","value":27},{"label":"BounceIn","value":28},{"label":"BounceOut","value":29},{"label":"BounceInOut","value":30}]}

var easings = [Linear, QuadraticIn, QuadraticOut, QuadraticInOut,
						CubicIn, CubicOut, CubicInOut,
						QuarticIn, QuarticOut, QuarticInOut,
						QuinticIn, QuinticOut, QuinticInOut,
						SinusoidalIn, SinusoidalOut, SinusoidalInOut,
						ExponentialIn, ExponentialOut, ExponentialInOut,
						CircularIn, CircularOut, CircularInOut,
						ElasticIn, ElasticOut, ElasticInOut,
						BackIn, BackOut, BackInOut,
						BounceIn, BounceOut, BounceInOut];

global.EasingCall = function (id, k)
{
	return easings[id](k);
}


global.GetEasing = function (id)
{
	return easings[id];
}


//Easings
//Ref : https://github.com/tweenjs/tween.js/blob/master/src/Tween.js

//List of Easings :

// - Linear
// - QuadraticIn - QuadraticOut - QuadraticInOut
// - CubicIn - CubicOut - CubicInOut
// - QuarticIn - QuarticOut - QuarticInOut
// - QuinticIn - QuinticOut - QuinticInOut
// - QuinticIn - QuinticOut - QuinticInOut
// - SinusoidalIn - SinusoidalOut - SinusoidalInOut
// - ExponentialIn - ExponentialOut - ExponentialInOut
// - CircularIn - CircularOut - CircularInOut
// - ElasticIn - ElasticOut - ElasticInOut
// - BackIn - BackOut - BackInOut
// - BounceIn - BounceOut - BounceInOut


// Global Call
// Il suffit de copier coller la ligne en dessous en ajoutant "@" au début de la ligne.
//input int easingShow {"widget":"combobox","values":[{"label":"Linear","value":0},{"label":"QuadraticIn","value":1},{"label":"QuadraticOut","value":2},{"label":"QuadraticInOut","value":3},{"label":"CubicIn","value":4},{"label":"CubicOut","value":5},{"label":"CubicInOut","value":6},{"label":"QuarticIn","value":7},{"label":"QuarticOut","value":8},{"label":"QuarticInOut","value":9},{"label":"QuinticIn","value":10},{"label":"QuinticOut","value":11},{"label":"QuinticInOut","value":12},{"label":"SinusoidalIn","value":13},{"label":"SinusoidalOut","value":14},{"label":"SinusoidalInOut","value":15},{"label":"ExponentialIn","value":16},{"label":"ExponentialOut","value":17},{"label":"ExponentialInOut","value":18},{"label":"CircularIn","value":19},{"label":"CircularOut","value":20},{"label":"CircularInOut","value":21},{"label":"ElasticIn","value":22},{"label":"ElasticOut","value":23},{"label":"ElasticInOut","value":24},{"label":"BackIn","value":25},{"label":"BackOut","value":26},{"label":"BackInOut","value":27},{"label":"BounceIn","value":28},{"label":"BounceOut","value":29},{"label":"BounceInOut","value":30}]}



//////////////////////////////////////////
//				Linear
//////////////////////////////////////////
global.Linear = function (k)
{
	return k;
}


//////////////////////////////////////////
//				Quadratic
//////////////////////////////////////////
global.QuadraticIn = function (k)
{
	return k * k;
}

global.QuadraticOut = function (k)
{
	return k * (2 - k);
}

global.QuadraticInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return 0.5 * k * k;
	}
	return - 0.5 * (--k * (k - 2) - 1);
}


//////////////////////////////////////////
//				Cubic
//////////////////////////////////////////
global.CubicIn = function (k)
{
	return k * k * k;
}

global.CubicOut = function (k)
{
	return --k * k * k + 1;
}

global.CubicInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return 0.5 * k * k * k;
	}
	return 0.5 * ((k -= 2) * k * k + 2);
}


//////////////////////////////////////////
//				Quartic
//////////////////////////////////////////
global.QuarticIn = function (k)
{
	return k * k * k * k;
}

global.QuarticOut = function (k)
{
	return 1 - (--k * k * k * k);
}

global.QuarticInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return 0.5 * k * k * k * k;
	}
	return - 0.5 * ((k -= 2) * k * k * k - 2);
}


//////////////////////////////////////////
//				Quintic
//////////////////////////////////////////
global.QuinticIn = function (k)
{
	return k * k * k * k * k;
}

global.QuinticOut = function (k)
{
	return --k * k * k * k * k + 1;
}

global.QuinticInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return 0.5 * k * k * k * k * k;
	}
	return 0.5 * ((k -= 2) * k * k * k * k + 2);
}


//////////////////////////////////////////
//				Sinusoidal
//////////////////////////////////////////
global.SinusoidalIn = function (k)
{
	return 1 - Math.cos(k * Math.PI / 2);
}

global.SinusoidalOut = function (k)
{
	return Math.sin(k * Math.PI / 2);
}

global.SinusoidalInOut = function (k)
{
	return 0.5 * (1 - Math.cos(Math.PI * k));
}


//////////////////////////////////////////
//				Exponential
//////////////////////////////////////////
global.ExponentialIn = function (k)
{
	return k === 0 ? 0 : Math.pow(1024, k - 1);
}

global.ExponentialOut = function (k)
{
	return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);
}

global.ExponentialInOut = function (k)
{
	if (k === 0)
	{
		return 0;
	}
	if (k === 1)
	{
		return 1;
	}
	if ((k *= 2) < 1)
	{
		return 0.5 * Math.pow(1024, k - 1);
	}
	return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
}


//////////////////////////////////////////
//				Circular
//////////////////////////////////////////
global.CircularIn = function (k)
{
	return 1 - Math.sqrt(1 - k * k);
}

global.CircularOut = function (k)
{
	return Math.sqrt(1 - (--k * k));
}

global.CircularInOut = function (k)
{
	if ((k *= 2) < 1)
	{
		return - 0.5 * (Math.sqrt(1 - k * k) - 1);
	}
	return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
}


//////////////////////////////////////////
//				Elastic
//////////////////////////////////////////
global.ElasticIn = function (k)
{
	if (k === 0)
	{
		return 0;
	}
	if (k === 1)
	{
		return 1;
	}
	return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
}

global.ElasticOut = function (k)
{
	if (k === 0)
	{
		return 0;
	}
	if (k === 1)
	{
		return 1;
	}
	return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
}

global.ElasticInOut = function (k)
{
	if (k === 0)
	{
		return 0;
	}
	if (k === 1)
	{
		return 1;
	}

	k *= 2;

	if (k < 1)
	{
		return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
	}
	return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
}


//////////////////////////////////////////
//				Back
//////////////////////////////////////////
global.BackIn = function (k)
{
	var s = 1.70158;
	return k * k * ((s + 1) * k - s);
}

global.BackOut = function (k)
{
	var s = 1.70158;
	return --k * k * ((s + 1) * k + s) + 1;
}

global.BackInOut = function (k)
{
	var s = 1.70158 * 1.525;
	if ((k *= 2) < 1)
	{
		return 0.5 * (k * k * ((s + 1) * k - s));
	}
	return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
}


//////////////////////////////////////////
//				Bounce
//////////////////////////////////////////
global.BounceIn = function (k)
{
	return 1 - BounceOut(1 - k);
}

global.BounceOut = function (k)
{
	if (k < (1 / 2.75))
	{
		return 7.5625 * k * k;
	}
	else if (k < (2 / 2.75))
	{
		return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
	}
	else if (k < (2.5 / 2.75))
	{
		return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
	}
	else
	{
		return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
	}
}

global.BounceInOut = function (k)
{
	if (k < 0.5)
	{
		return BounceIn(k * 2) * 0.5;
	}
	return BounceOut(k * 2 - 1) * 0.5 + 0.5;
}



//////////////////////////////////////////
//				Cubic Bezier
//////////////////////////////////////////
global.CubicBezier = function (k, B, C)
{
	if (k === 0)
	{
		return 0;
	}
	else if (k === 1)
	{
		return 1;
	}
	else
	{
		var d = -k;
		var c = 3*B.x;
		var b = -6*B.x + 3*C.x;
		var a = 3*B.x - 3*C.x + 1;
	
		var root = getCorrectRoot(solveCubic(a, b, c, d));
	
		return B.y * (3 * Math.pow(1-root, 2) * root) + (C.y * (3 * (1-root) * root * root)) + (root * root * root);
	}
}


global.GetCubicBezierFunction = function (B, C)
{
	return function(k) { return global.CubicBezier(k, B, C); };
}


function cuberoot(x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
}


function solveCubic(a, b, c, d) {
    if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2+bx+c=0
        a = b; b = c; c = d;
        if (Math.abs(a) < 1e-8) { // Linear case, ax+b=0
            a = b; b = c;
            if (Math.abs(a) < 1e-8) // Degenerate case
                return [];
            return [-b/a];
        }

        var D = b*b - 4*a*c;
        if (Math.abs(D) < 1e-8)
            return [-b/(2*a)];
        else if (D > 0)
            return [(-b+Math.sqrt(D))/(2*a), (-b-Math.sqrt(D))/(2*a)];
        return [];
    }

    // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
    var p = (3*a*c - b*b)/(3*a*a);
    var q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
    var roots;

    if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
        roots = [cuberoot(-q)];
    } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
        roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
        var D = q*q/4 + p*p*p/27;
        if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
            roots = [-1.5*q/p, 3*q/p];
        } else if (D > 0) {             // Only one real root
            var u = cuberoot(-q/2 - Math.sqrt(D));
            roots = [u - p/(3*u)];
        } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
            var u = 2*Math.sqrt(-p/3);
            var t = Math.acos(3*q/p/u)/3;  // D < 0 implies p < 0 and acos argument in [-1..1]
            var k = 2*Math.PI/3;
            roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
        }
    }

    // Convert back from depressed cubic
    for (var i = 0; i < roots.length; i++)
        roots[i] -= b/(3*a);

    return roots;
}


function getCorrectRoot (roots)
{
	for (var i = 0; i < roots.length; ++i)
	{
		if (roots[i] >= 0 && roots[i] <= 1)
		{
			return roots[i];
		}
	}

	print("Error : root not found for CubicBezier, returning 0 instead !")
	return 0;
}


//////////////////////////////////////////
//				Global Call
//////////////////////////////////////////
//To use as an input : "@"
//input int easingShow {"widget":"combobox","values":[{"label":"Linear","value":0},{"label":"QuadraticIn","value":1},{"label":"QuadraticOut","value":2},{"label":"QuadraticInOut","value":3},{"label":"CubicIn","value":4},{"label":"CubicOut","value":5},{"label":"CubicInOut","value":6},{"label":"QuarticIn","value":7},{"label":"QuarticOut","value":8},{"label":"QuarticInOut","value":9},{"label":"QuinticIn","value":10},{"label":"QuinticOut","value":11},{"label":"QuinticInOut","value":12},{"label":"SinusoidalIn","value":13},{"label":"SinusoidalOut","value":14},{"label":"SinusoidalInOut","value":15},{"label":"ExponentialIn","value":16},{"label":"ExponentialOut","value":17},{"label":"ExponentialInOut","value":18},{"label":"CircularIn","value":19},{"label":"CircularOut","value":20},{"label":"CircularInOut","value":21},{"label":"ElasticIn","value":22},{"label":"ElasticOut","value":23},{"label":"ElasticInOut","value":24},{"label":"BackIn","value":25},{"label":"BackOut","value":26},{"label":"BackInOut","value":27},{"label":"BounceIn","value":28},{"label":"BounceOut","value":29},{"label":"BounceInOut","value":30}]}

var easings = [Linear, QuadraticIn, QuadraticOut, QuadraticInOut,
						CubicIn, CubicOut, CubicInOut,
						QuarticIn, QuarticOut, QuarticInOut,
						QuinticIn, QuinticOut, QuinticInOut,
						SinusoidalIn, SinusoidalOut, SinusoidalInOut,
						ExponentialIn, ExponentialOut, ExponentialInOut,
						CircularIn, CircularOut, CircularInOut,
						ElasticIn, ElasticOut, ElasticInOut,
						BackIn, BackOut, BackInOut,
						BounceIn, BounceOut, BounceInOut];

global.EasingCall = function (id, k)
{
	return easings[id](k);
}


global.GetEasing = function (id)
{
	return easings[id];
}


global.Lerp = function (min, max, coef, clamp)
{
    if (clamp !== false){
        coef = Math.max(0,Math.min(coef,1));
    }    
    
	return coef * (max - min) + min;
}

global.InverseLerp = function (min, max, value, clamp)
{
    if (clamp !== false){
        value = Math.max(min,Math.min(value,max));
    }    
    
	return (value - min) / (max - min);
}