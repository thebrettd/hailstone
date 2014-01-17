(function(){if (Meteor.isClient) {

    Template.hailstoneVisualization.sequence = function () {
        var sequence = Session.get("sequence");
        if (sequence != null) {

            return _.zip(sequence, _.range(sequence.length));
        }
    };

    Template.hailstoneVisualization.sequenceSize = function () {
        return Session.get("sequenceSize");
    };

    Template.hailstoneVisualization.max = function () {
        return d3.max(Session.get("sequence"));
    };

    Template.hailstoneVisualization.seed = function () {
        return Session.get("seed");
    };

    Template.hailstoneVisualization.rendered = function () {
        var width = 800;
        var height = 800;

        var hailStones = Session.get("sequence");
        var max = d3.max(hailStones);
        var viz = d3.select("#D3");

        var hailStoneMatrix = hailStoneAsMatrix(hailStones, max);

        /*d3.select("#D3")
         .append("table")
         .style("border-collapse", "collapse")
         .style("border", "2px black solid")

         .selectAll("tr")
         .data(dataset)
         .enter().append("tr")

         .selectAll("td")
         .data(function (d) {
         return d;
         })
         .enter().append("td")
         .style("border", "1px black solid")
         .style("padding", "10px")
         .on("mouseover", function () {
         d3.select(this).style("background-color", "aliceblue")
         })
         .on("mouseout", function () {
         d3.select(this).style("background-color", "white")
         })
         .text(function (d) {
         return d;
         })
         .style("font-size", "12px");
         */

        for (var i = 0; i < max; i++) {
            viz.append("div")
                .attr("id", "hailStone" + i);
        }

        for (var i = 0; i < hailStones.length; i++) {
            var div = d3.select("#hailStone" + i)
                .append("img")
                .attr("id", "hailStoneImg" + i)
                .attr("src", "hailstone.gif")
        }


    };


    Template.hailstoneForm.events({
        'click button': function (event, template) {
            // template data, if any, is available in 'this'
            var input = template.find("#seed").value;
            var sequence = computeSequence(input);
            Session.set("seed", input);
            Session.set("sequenceSize", sequence.length);
            Session.set("sequence", sequence);
        }
    });

    Template.hailstoneVisualization.sequenceClass = function () {
        if (Session.get("showSequence") === "TRUE") {
            return "visible";
        } else {
            return "hidden";
        }
    };

    Template.hailstoneVisualization.events({
        'click button': function (event, template) {
            var currValue = Session.get("showSequence");
            if (currValue === "TRUE") {
                Session.set("showSequence", "FALSE");
            } else {
                Session.set("showSequence", "TRUE");
            }
        }
    });

    function computeSequence(input) {
        var seq = [];
        while (input != 1) {
            if (input % 2 == 0) {
                input = input / 2;
                seq.push(input);
            } else {
                input = 3 * input + 1;
                seq.push(input);
            }
        }
        return seq;
    }

    function hailStoneAsMatrix(hailStones, max) {
        // rows, cols
        var numRows = Math.ceil(Math.sqrt(hailStones.length));
        var matrix = new Array(numRows);

        for (var i = 0; i < numRows; i++) {
            var columns = new Array(numRows);
            for (var j = 0; j < columns.length; j++) {
                columns[j] = hailStones[j] != null ? hailStones[j] : 0;
            }
            matrix[i] = columns;
        }
        return matrix;
    }

}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}

})();
