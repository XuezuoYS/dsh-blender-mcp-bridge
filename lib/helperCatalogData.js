/**
 * Helper catalog data, generated from the upstream create-3d-model helpers.
 *
 * Scripts are copied verbatim from
 * CheshireJCat/create-3d-model-skill `skills/create-3d-model` (MIT); see
 * helpers/README.md and helpers/LICENSES/ for provenance.
 *
 * @module lib/helperCatalogData
 */

export const HELPERS = [
  {
    "name": "animation-contact-sheet",
    "script": "animation_contact_sheet.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "Pillow"
    ],
    "params": [
      {
        "name": "frames",
        "flag": "--frames",
        "positional": false,
        "type": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out-image",
        "flag": "--out-image",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "out-report",
        "flag": "--out-report",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "cols",
        "flag": "--cols",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "atlas-region-detector",
    "script": "atlas_region_detector.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless"
    ],
    "params": [
      {
        "name": "image",
        "flag": "--image",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "mode",
        "flag": "--mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "min-area",
        "flag": "--min-area",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "pad",
        "flag": "--pad",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "atlas-region-mapper",
    "script": "atlas_region_mapper.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [],
    "params": [
      {
        "name": "parts",
        "flag": "--parts",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "regions",
        "flag": "--regions",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "max-candidates",
        "flag": "--max-candidates",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "skill-graph-audit",
    "script": "skill_graph_audit.py",
    "runtime": "python",
    "maintenance": true,
    "dependencies": [],
    "params": [
      {
        "name": "plugin-root",
        "flag": "--plugin-root",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      }
    ]
  },
  {
    "name": "surface-texture-coverage-audit",
    "script": "surface_texture_coverage_audit.py",
    "runtime": "blender",
    "maintenance": false,
    "dependencies": [],
    "params": [
      {
        "name": "objects",
        "flag": "--objects",
        "positional": false,
        "type": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      }
    ]
  },
  {
    "name": "mask-to-mesh-recipe",
    "script": "mask_to_mesh_recipe.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy",
      "scipy"
    ],
    "params": [
      {
        "name": "image",
        "flag": "--image",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "name",
        "flag": "--name",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "none"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "blender-script",
        "flag": "--blender-script",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "world-width",
        "flag": "--world-width",
        "positional": false,
        "type": {
          "type": "number"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "samples",
        "flag": "--samples",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "mode",
        "flag": "--mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "source-locked-skin-recipe",
    "script": "source_locked_skin_recipe.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy",
      "scipy"
    ],
    "params": [
      {
        "name": "image",
        "flag": "--image",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "mask-out",
        "flag": "--mask-out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "name",
        "flag": "--name",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "world-width",
        "flag": "--world-width",
        "positional": false,
        "type": {
          "type": "number"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "samples",
        "flag": "--samples",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "mode",
        "flag": "--mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "hue-min",
        "flag": "--hue-min",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "hue-max",
        "flag": "--hue-max",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "sat-min",
        "flag": "--sat-min",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "value-min",
        "flag": "--value-min",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "close-iters",
        "flag": "--close-iters",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "open-ksize",
        "flag": "--open-ksize",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "dilate-iters",
        "flag": "--dilate-iters",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "epsilon-frac",
        "flag": "--epsilon-frac",
        "positional": false,
        "type": {
          "type": "number"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "fit-repair-queue",
    "script": "fit_repair_queue.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [],
    "params": [
      {
        "name": "fit-report",
        "flag": "--fit-report",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "texture-lighting-report",
        "flag": "--texture-lighting-report",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "method-md",
        "flag": "--method-md",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      }
    ]
  },
  {
    "name": "landmark-fit-report",
    "script": "landmark_fit_report.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [],
    "params": [
      {
        "name": "source",
        "flag": "--source",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "product",
        "flag": "--product",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "tolerance-px",
        "flag": "--tolerance-px",
        "positional": false,
        "type": {
          "type": "number"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "view-constraint-report",
    "script": "view_constraint_report.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [],
    "params": [
      {
        "name": "input",
        "flag": "--input",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "tolerance",
        "flag": "--tolerance",
        "positional": false,
        "type": {
          "type": "number"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "multiview-fit-report",
    "script": "multiview_fit_report.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy"
    ],
    "params": [
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "overlay-dir",
        "flag": "--overlay-dir",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in-dir"
      }
    ]
  },
  {
    "name": "orbit-layout-manifest",
    "script": "orbit_layout_manifest.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [],
    "params": [
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "radii",
        "flag": "--radii",
        "positional": false,
        "type": {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "markers",
        "flag": "--markers",
        "positional": false,
        "type": {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "arc-break-deg",
        "flag": "--arc-break-deg",
        "positional": false,
        "type": {
          "type": "number"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "register-orthographic-views",
    "script": "register_views.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless"
    ],
    "params": [
      {
        "name": "images",
        "flag": null,
        "positional": true,
        "type": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      }
    ]
  },
  {
    "name": "quality-refinement-plan",
    "script": "ralph_autoloop_plan.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [],
    "params": [
      {
        "name": "feedback",
        "flag": "--feedback",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "none"
      },
      {
        "name": "artifact",
        "flag": "--artifact",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      }
    ]
  },
  {
    "name": "release-readiness-check",
    "script": "release_readiness_check.py",
    "runtime": "python",
    "maintenance": true,
    "dependencies": [],
    "params": [
      {
        "name": "repo-root",
        "flag": "--repo-root",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "expected-version",
        "flag": "--expected-version",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "none"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      }
    ]
  },
  {
    "name": "sanitize-skill-contributions",
    "script": "sanitize_skill_contributions.py",
    "runtime": "python",
    "maintenance": true,
    "dependencies": [],
    "params": [
      {
        "name": "root",
        "flag": "--root",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "terms",
        "flag": "--terms",
        "positional": false,
        "type": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "allow",
        "flag": "--allow",
        "positional": false,
        "type": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "reference-manifest-compiler",
    "script": "reference_manifest_compiler.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy"
    ],
    "params": [
      {
        "name": "inputs",
        "flag": null,
        "positional": true,
        "type": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "required": true,
        "path": "none"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "mode",
        "flag": "--mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "min-area",
        "flag": "--min-area",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "render-overlay-validator",
    "script": "render_overlay_validator.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy"
    ],
    "params": [
      {
        "name": "reference",
        "flag": "--reference",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "render",
        "flag": "--render",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "overlay",
        "flag": "--overlay",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "mode",
        "flag": "--mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "reference-mode",
        "flag": "--reference-mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "render-mode",
        "flag": "--render-mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "look-fit-report",
    "script": "look_fit_report.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless"
    ],
    "params": [
      {
        "name": "reference",
        "flag": "--reference",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "product",
        "flag": "--product",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "overlay",
        "flag": "--overlay",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "accent-hue-min",
        "flag": "--accent-hue-min",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "accent-hue-max",
        "flag": "--accent-hue-max",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "silhouette-validator",
    "script": "silhouette_validator.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy"
    ],
    "params": [
      {
        "name": "reference",
        "flag": "--reference",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "render",
        "flag": "--render",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "threshold",
        "flag": "--threshold",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "template-analyzer",
    "script": "template_analyzer.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy"
    ],
    "params": [
      {
        "name": "image",
        "flag": "--image",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "mode",
        "flag": "--mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "min-area-frac",
        "flag": "--min-area-frac",
        "positional": false,
        "type": {
          "type": "number"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "min-score-frac",
        "flag": "--min-score-frac",
        "positional": false,
        "type": {
          "type": "number"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "canny1",
        "flag": "--canny1",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "canny2",
        "flag": "--canny2",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "dilate",
        "flag": "--dilate",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "mask-out",
        "flag": "--mask-out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      }
    ]
  },
  {
    "name": "seeded-part-masks",
    "script": "seeded_part_masks.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy"
    ],
    "params": [
      {
        "name": "manifest",
        "flag": "--manifest",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out-dir",
        "flag": "--out-dir",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out-dir"
      }
    ]
  },
  {
    "name": "segment-source-parts",
    "script": "segment_source_parts.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless"
    ],
    "params": [
      {
        "name": "image",
        "flag": "--image",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out-dir",
        "flag": "--out-dir",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out-dir"
      },
      {
        "name": "mode",
        "flag": "--mode",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "min-area",
        "flag": "--min-area",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      },
      {
        "name": "watershed",
        "flag": "--watershed",
        "positional": false,
        "type": {
          "type": "boolean"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "contour-correspondence-report",
    "script": "contour_correspondence_report.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [],
    "params": [
      {
        "name": "source-mask",
        "flag": "--source-mask",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "product-mask",
        "flag": "--product-mask",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "samples",
        "flag": "--samples",
        "positional": false,
        "type": {
          "type": "integer"
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "texture-transition-plan",
    "script": "texture_transition_plan.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "Pillow"
    ],
    "params": [
      {
        "name": "images",
        "flag": "--images",
        "positional": false,
        "type": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "out",
        "flag": "--out",
        "positional": false,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "out",
        "defaultOutput": true
      },
      {
        "name": "names",
        "flag": "--names",
        "positional": false,
        "type": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "required": false,
        "path": "none"
      }
    ]
  },
  {
    "name": "wireframe-analyzer",
    "script": "wireframe_analyzer.py",
    "runtime": "python",
    "maintenance": false,
    "dependencies": [
      "opencv-python-headless",
      "numpy",
      "scipy"
    ],
    "params": [
      {
        "name": "image",
        "flag": null,
        "positional": true,
        "type": {
          "type": "string"
        },
        "required": true,
        "path": "in"
      },
      {
        "name": "output",
        "flag": null,
        "positional": true,
        "type": {
          "type": "string"
        },
        "required": false,
        "path": "out",
        "defaultOutput": true
      }
    ]
  }
]
