<!-- source: manual/modeling/geometry_nodes/hair/read/curve_segment.rst -->

*************

The *Curve Segment* node provides information about the segment connecting
each point on a curve to its previous point.
It is useful for analyzing or manipulating per-segment data, such as length,
direction, or connectivity, and for constructing effects that depend on local curve structure.

This node has no inputs.

Segment Length
The distance between the current point and its previous point on the same curve.
This can be used for evaluating curve smoothness, detecting segment stretching,
or applying deformation relative to curve length.

Segment Direction
A normalized vector pointing from the previous point toward the current point.
It represents the local tangent direction of the curve segment.

Neighbor Index
The index of the previous neighboring point along the curve.
This can be used to reference or sample attributes from adjacent points.
