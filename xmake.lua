add_rules('mode.debug', 'mode.release')

set_languages('cxx20')

package('json')
  add_deps('cmake')
  set_sourcedir(path.join(os.scriptdir(), 'vendor/json'))
  on_install(function (package)
    local configs = {}
    import('package.tools.cmake').install(package, configs)
  end)
package_end()

add_requires(
  'json'
)

target('cpp')
  set_kind('binary')
  add_packages('json')
  add_syslinks("pthread")
  add_files('src/*.cpp')
  add_includedirs(
    'vendor/cpp-httplib',
    'vendor/json/include/nlohmann'
  )
  -- set_optimize("fastest")
  -- custom run function
  on_run(function (target)
    os.cd(os.projectdir())
    os.exec(target:targetfile())
  end)
target_end()

task('install_vendor')
  set_menu {
    usage = 'xmake install_vendor',
    description = 'downloads vendor library',
    options = {}
  }
  on_run(function ()
    if not os.exists('vendor') then
      os.mkdir('vendor')
    end
    if os.exists('vendor') then
      os.cd('vendor')
      os.exec('git clone https://github.com/nlohmann/json')
      os.exec('git clone https://github.com/yhirose/cpp-httplib')
    end
  end)
task_end()
