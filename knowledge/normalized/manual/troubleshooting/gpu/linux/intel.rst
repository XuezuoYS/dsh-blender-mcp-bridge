<!-- source: manual/troubleshooting/gpu/linux/intel.rst -->

******************************

:orphan:

Blender uses OpenGL for the 3D Viewport and user interface. The graphics processing unit (GPU) and driver have a big
impact on Blender's behavior and performance.

This section lists possible solutions for graphics glitches, problems with EEVEE and Cycles, and crashes related to
your GPU.

Upgrading to the latest graphics drivers often solves problems. Newer drivers have bug fixes that help Blender
function correctly.

:start-line: 1

On Linux, graphics drivers are usually installed as a package by your Linux distribution. Installing the latest
drivers is typically done by upgrading packages or the distribution as a whole. Some distributions provide multiple
packages for multiple drivers versions, giving you the choice to install newer versions.

:orphan:

A lot of fixes for AMD and Intel GPUs are backported into the Mesa drivers. Therefore it is recommended to install or
upgrade to their latest point `releases <https://docs.mesa3d.org/relnotes.html>`__. For certain Linux distribution
versions this can be done using custom repositories. For example, using the `kisak-mesa PPA
<https://launchpad.net/~kisak/+archive/ubuntu/kisak-mesa>`__ for Ubuntu.

:orphan:

This means your graphics card and driver do not have the minimum required OpenGL 3.3 version needed by Blender.

Installing the latest version of the correct driver can help upgrade the OpenGL version, though some graphics cards
are simply too old to run the latest Blender. In such cases, using Blender 2.79 or earlier is the only option.
Starting with Blender 2.8 (which added EEVEE), there is less support for older graphics hardware.

Try running Blender from the :doc:`command line </advanced/command_line/index>`, to see if any helpful error messages
are printed.

On Windows, graphics drivers can sometimes get corrupted or incorrectly replaced by Windows Update. In this case, it
can help to uninstall all graphics drivers (there may be multiple sets installed from Intel, AMD and NVIDIA) and
perform a clean installation with drivers from the manufacturer's website.

- Update your graphics drivers (see above).
- On laptops, make sure you are using a dedicated GPU (see above).
- Try lowering quality settings in :menuselection:`Preferences --> System --> Memory & Limits`.
- Try undoing settings in your graphics drivers, if you made any changes there.

See :doc:`EEVEE </render/eevee/limitations/index>` and :doc:`Cycles </render/cycles/gpu_rendering>` documentation
respectively.

See :ref:`Invalid Selection, Disable Anti-Aliasing <troubleshooting-3dview-invalid-selection>`.

Running Blender inside a virtual machine is known to have problems when OpenGL drawing calls are forwarded to the host
operating system.

To resolve this, configure the system to use PCI passthrough.

Some VM hosts may require turning on GPU paravirtualization. Some GPU vendors restrict this function to higher-priced
cards or models.

To find out which graphics card and driver Blender is using, use :menuselection:`Help --> Save System Info` inside
Blender. The OpenGL section will have information about your graphics card, vendor and driver version.

:start-line: 1

:start-line: 1
