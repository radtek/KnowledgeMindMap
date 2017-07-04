using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Caching;
using System.IO;
using System.Reflection;
using System.Collections;

namespace Yinhe.WebHost
{
    public class AssemblyResourceProvider : System.Web.Hosting.VirtualPathProvider
    {
        /// <summary>
        /// 判断虚拟文件路径是否来自插件的资源文件
        /// </summary>
        /// <param name="virtualPath"></param>
        /// <returns></returns>
        private bool IsAppResourcePath(string virtualPath)
        {
            
            String checkPath = VirtualPathUtility.ToAppRelative(virtualPath);
            return checkPath.StartsWith("~/Plugins/", StringComparison.InvariantCultureIgnoreCase);
        }


        /// <summary>
        /// 通过读取程序及获取内容资源名,  防止内存溢出
        /// </summary>
        /// <param name="assemblyName"></param>
        /// <returns></returns>
        public string[] GetAssemblyResourceNames(string assemblyName)
        {
            var assemblyCachaName = string.Format("GetAssemblyResourceNames_{0}", assemblyName);
            var hitCacheObj = Yinhe.ProcessingCenter.CacheHelper.GetCache(assemblyCachaName);

            if (hitCacheObj == null)
            {
                byte[] assemblyBytes = File.ReadAllBytes(assemblyName);
                Assembly assembly = Assembly.Load(assemblyBytes);
                if (assembly != null)
                {
                    var resourceList = assembly.GetManifestResourceNames();
                    Yinhe.ProcessingCenter.CacheHelper.SetCache(assemblyCachaName, resourceList, null, DateTime.Now.AddDays(30));
                    return resourceList;

                }
                else
                {
                    Yinhe.ProcessingCenter.CacheHelper.SetCache(assemblyCachaName, new string[] { }, null, DateTime.Now.AddDays(30));
                    return null;
                }

            }
            else
            {
                return hitCacheObj as string[];
            }

        }
        /// <summary>
        /// 重写System.Web.Hosting.VirtualPathProvider.FileExists,获取一个值，该值指示文件是否存在于虚拟文件系统中
        /// </summary>
        /// <param name="virtualPath"></param>
        /// <returns></returns>
        public override bool FileExists(string virtualPath)
        {
            if (IsAppResourcePath(virtualPath))        
            {
                string path = VirtualPathUtility.ToAppRelative(virtualPath);
                string[] parts = path.Split('/');
                string assemblyName = parts[2];         //程序集名称
                string resourceName = parts[3];         //对应资源名称

                assemblyName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Plugins", assemblyName);  //获取对应程序集的文件
                string[] resourceList = GetAssemblyResourceNames(assemblyName);

                if (resourceList != null)
                {
                    //TextLog.writeLog(String.Join("   ", resourceList));
                    bool found = Array.Exists(resourceList, delegate(string r) { return r.Equals(resourceName); });
                    return found;

                }
                return false;
            }
            else                                    //返回默认方法值
            {
                return base.FileExists(virtualPath);
            }
        }

        /// <summary>
        /// 重写System.Web.Hosting.VirtualPathProvider.GetFile,从虚拟文件系统中获取一个虚拟文件
        /// </summary>
        /// <param name="virtualPath"></param>
        /// <returns></returns>
        public override VirtualFile GetFile(string virtualPath)
        {
            if (IsAppResourcePath(virtualPath))     
                return new AssemblyResourceVirtualFile(virtualPath);    
            else
                return base.GetFile(virtualPath);
        }

        /// <summary>
        /// 重写System.Web.Hosting.VirtualPathProvider.GetCacheDependency,基于指定的虚拟路径创建一个缓存依赖项
        /// </summary>
        /// <param name="virtualPath"></param>
        /// <param name="virtualPathDependencies"></param>
        /// <param name="utcStart"></param>
        /// <returns></returns>
        public override CacheDependency GetCacheDependency(string virtualPath, IEnumerable virtualPathDependencies, DateTime utcStart)
        {
            if (IsAppResourcePath(virtualPath))     
            {
                //string[] parts = virtualPath.Split('/');
                //string assemblyName = parts[2];

                //assemblyName = Path.Combine(_PluginDirectory, assemblyName);

                //return new CacheDependency(assemblyName);
                return null;
            }

            return base.GetCacheDependency(virtualPath, virtualPathDependencies, utcStart);
        }
    }
}

