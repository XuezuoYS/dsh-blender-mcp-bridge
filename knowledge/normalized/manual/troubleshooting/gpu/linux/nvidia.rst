<!-- source: manual/troubleshooting/gpu/linux/nvidia.rst -->

*******************************

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

For NVIDIA, there are open source (Nouveau) and closed source (by NVIDIA) graphics drivers. Blender functions best
with the closed source drivers as they are more optimized and complete. Linux graphics drivers can be downloaded from
NVIDIA's website, however in most cases the ones from your Linux distribution are fine and make things easier.
Manually downloading drivers is mostly useful to get the very latest version, for example for a GPU that was only
recently released.

Note, drivers before 550 do not support Vulkan!

`NVIDIA Website <https://www.nvidia.com/en-us/drivers/>`__

:orphan:

Laptops often have two GPUs for power saving purposes. One slower onboard GPU integrated into the main CPU (typically
Intel or AMD) that uses lower power, and one faster dedicated GPU for better performance (AMD or NVIDIA) that uses
more power.

For the best performance, the dedicated GPU should be used for Blender. Which GPU to use for which application can be
configured in your graphics driver or operating system settings.

If there is a graphics glitch or crash specific to the onboard GPU, then using the dedicated GPU can help avoid that.
Or vice versa, if the dedicated GPU causes issues, then using the onboard graphics can help.

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
