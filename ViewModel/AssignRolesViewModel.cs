namespace InventoryBeginners.ViewModel
{
    public class AssignRolesViewModel
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public List<SelectListItem> Roles { get; set; }
        public List<string> SelectedRoleNames { get; set; }
    }
}
