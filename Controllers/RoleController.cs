using InventoryBeginners.ViewModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace InventoryBeginners.Controllers
{
    public class RoleController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleController(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public IActionResult Index()
        {
            var users = _userManager.Users.ToList();
            var roles = _roleManager.Roles.ToList();

            var viewModelList = new List<AssignRolesViewModel>();

            foreach (var user in users)
            {
                var userRoles = _userManager.GetRolesAsync(user);
                var viewModel = new AssignRolesViewModel
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Roles = roles.Select(r => new SelectListItem
                    {
                        Text = r.Name,
                        Value = r.Name,
                        Selected = userRoles.Equals(r.Name)
                    }).ToList()
                };
                viewModelList.Add(viewModel);
            }

            return View(viewModelList);
        }

        //public IActionResult Create()
        //{
        //    return View(new IdentityRole());
        //}
        [HttpPost]
        public async Task<IActionResult> Create(IdentityRole role)
        {
            await _roleManager.CreateAsync(role);
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> AssignRoles(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                // Handle the scenario where user is not found.
                return RedirectToAction("UserNotFound", "Error");
            }

            var roles = await _roleManager.Roles.ToListAsync(); // Assuming you're using Entity Framework Core for async operations

            var viewModel = new AssignRolesViewModel
            {
                UserId = userId,
                UserName = user.UserName,
                Roles = roles.Select(r => new SelectListItem
                {
                    Text = r.Name,
                    Value = r.Name
                }).ToList()
            };

            return View(viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> AssignRoles(AssignRolesViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                // Handle the scenario where user is not found.
                return RedirectToAction("UserNotFound", "Error");
            }

            foreach (var roleName in model.SelectedRoleNames)
            {
                if (!await _userManager.IsInRoleAsync(user, roleName))
                {
                    await _userManager.AddToRoleAsync(user, roleName);
                }
            }

            return RedirectToAction("AssignRoles", "Role");
        }

        public async Task<IActionResult> UpdateRolesForUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                // Handle the scenario where user is not found.
                return RedirectToAction("UserNotFound", "Error");
            }

            var roles = await _roleManager.Roles.ToListAsync();

            var viewModel = new AssignRolesViewModel
            {
                UserId = userId,
                UserName = user.UserName,
                Roles = roles.Select(r => new SelectListItem
                {
                    Text = r.Name,
                    Value = r.Name
                }).ToList()
            };

            return View(viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateRolesForUser(AssignRolesViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                // Handle the scenario where user is not found.
                return RedirectToAction("UserNotFound", "Error");
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, userRoles);

            foreach (var roleName in model.SelectedRoleNames)
            {
                var roleExists = await _roleManager.RoleExistsAsync(roleName);
                if (!roleExists)
                {
                    // Handle the scenario where role doesn't exist.
                    continue;
                }

                await _userManager.AddToRoleAsync(user, roleName);
            }

            return RedirectToAction("Index", "Home");
        }

        public IActionResult RoleIndex()
        {
            var roles = _roleManager.Roles.ToList();
            return View(roles);
        }

        public async Task<IActionResult> RoleCreate()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> RoleCreate(string roleName)
        {
            if (ModelState.IsValid)
            {
                var role = new IdentityRole(roleName);
                var result = await _roleManager.CreateAsync(role);

                if (result.Succeeded)
                {
                    return RedirectToAction("RoleIndex");
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }
            return View(roleName);
        }

        public async Task<IActionResult> RoleEdit(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            return View(role);
        }

        [HttpPost]
        public async Task<IActionResult> RoleEdit(string id, string roleName)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                role.Name = roleName;
                var result = await _roleManager.UpdateAsync(role);

                if (result.Succeeded)
                {
                    return RedirectToAction("Index");
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }
            return View(roleName);
        }

        public async Task<IActionResult> RoleDelete(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            return View(role);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteRoleConfirmed(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }

            var result = await _roleManager.DeleteAsync(role);
            if (result.Succeeded)
            {
                return RedirectToAction("Index");
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }
            return View(role);
        }
    }
}
