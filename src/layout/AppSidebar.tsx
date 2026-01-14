import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxIcon,
  ChevronDownIcon,
  DocsIcon,
  GridIcon,
  HorizontaLDots,
  DollarLineIcon,
  PieChartIcon,
  ShootingStarIcon,
  TableIcon,
  TaskIcon,
  AngleUpIcon,
  FileIcon,
  ListIcon,
  PencilIcon,
  BoxCubeIcon,
  PlugInIcon,
  BoltIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useBusinessData } from "../context/BusinessDataContext";
import { useMode } from "../context/ModeContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  comingSoon?: boolean;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    comingSoon?: boolean;
  }[];
};

const baseNavItems: NavItem[] = [
  {
    icon: <ShootingStarIcon />,
    name: "North Star",
    path: "/north-star",
  },
  {
    icon: <GridIcon />,
    name: "Lean Canvas",
    path: "/lean-canvas",
  },
  {
    icon: <DollarLineIcon />,
    name: "Lean Viability",
    path: "/lean-viability",
  },
  {
    icon: <PieChartIcon />,
    name: "Customers Factory",
    path: "/customer-factory",
  },
  {
    icon: <AngleUpIcon />,
    name: "Architectural Scope",
    path: "/architectural-scope",
  },
  {
    icon: <FileIcon />,
    name: "Policy Charter",
    path: "/policy-charter",
  },
  {
    icon: <TableIcon />,
    name: "Roadmap",
    path: "/roadmap",
  },
  {
    icon: <TaskIcon />,
    name: "Backlog",
    path: "/backlog",
    comingSoon: true,
  },
];

const baseSoftwareLayerItems: NavItem[] = [
  {
    icon: <BoxIcon />,
    name: "C4 Architecture",
    path: "/c4",
  },
  {
    icon: <BoxIcon />,
    name: "Terraform",
    path: "/terraform",
    comingSoon: true,
  },
];

const baseDDDLayersItems: NavItem[] = [
  {
    icon: <ListIcon />,
    name: "Subdomains",
    path: "/subdomains",
    comingSoon: true,
  },
  {
    icon: <BoxIcon />,
    name: "Bounded Contexts",
    path: "/bounded-contexts",
    comingSoon: true,
  },
  {
    icon: <TableIcon />,
    name: "Contexts Map",
    path: "/contexts-map",
    comingSoon: true,
  },
  {
    icon: <GridIcon />,
    name: "Event Storming",
    path: "/event-storming",
    comingSoon: true,
  },
];

const baseEducationalLayersItems: NavItem[] = [
  {
    icon: <PencilIcon />,
    name: "Tripwire",
    path: "/tripwire",
  },
];

const baseMiscItems: NavItem[] = [
  {
    icon: <DocsIcon />,
    name: "Documents",
    path: "/misc",
  },
];

// Software Factory navigation items
const factoryWorkflowItems: NavItem[] = [
  {
    icon: <BoxCubeIcon />,
    name: "Workflows",
    path: "/factory/workflows",
  },
  {
    icon: <BoltIcon />,
    name: "Executions",
    path: "/factory/executions",
    comingSoon: true,
  },
  {
    icon: <GridIcon />,
    name: "Templates",
    path: "/factory/templates",
    comingSoon: true,
  },
];

const factoryProviderItems: NavItem[] = [
  {
    icon: <PlugInIcon />,
    name: "Providers",
    path: "/factory/providers",
    comingSoon: true,
  },
];

// Compact mode switcher for sidebar
const ModeSwitcherCompact: React.FC<{ isExpanded: boolean }> = ({
  isExpanded,
}) => {
  const { mode, toggleMode } = useMode();
  const isBlueprint = mode === "blueprint";

  return (
    <button
      onClick={toggleMode}
      className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
        isBlueprint
          ? "text-blue-600 dark:text-blue-400"
          : "text-purple-600 dark:text-purple-400"
      }`}
      title={`Switch to ${isBlueprint ? "Software Factory" : "Blueprint"}`}
    >
      {isBlueprint ? (
        <DocsIcon className="w-8 h-8 flex-shrink-0" />
      ) : (
        <BoxCubeIcon className="w-8 h-8 flex-shrink-0" />
      )}
      {isExpanded && (
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold whitespace-nowrap">
            {isBlueprint ? "BLUEPRINT" : "FACTORY"}
          </span>
          <svg
            className="w-4 h-4 opacity-50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 16L12 21L17 16M7 8L12 3L17 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { productName } = useBusinessData();
  const { mode } = useMode();
  const location = useLocation();

  const navItems = useMemo(
    () =>
      baseNavItems.map((item) => ({
        ...item,
        path: item.path ? `/${productName}${item.path}` : undefined,
        subItems: item.subItems?.map((sub) => ({
          ...sub,
          path: sub.path ? `/${productName}${sub.path}` : sub.path,
        })),
      })),
    [productName]
  );

  const softwareLayerItems = useMemo(
    () =>
      baseSoftwareLayerItems.map((item) => ({
        ...item,
        path: item.path ? `/${productName}${item.path}` : undefined,
        subItems: item.subItems?.map((sub) => ({
          ...sub,
          path: sub.path ? `/${productName}${sub.path}` : sub.path,
        })),
      })),
    [productName]
  );

  const dddLayerItems = useMemo(
    () =>
      baseDDDLayersItems.map((item) => ({
        ...item,
        path: item.path ? `/${productName}${item.path}` : undefined,
        subItems: item.subItems?.map((sub) => ({
          ...sub,
          path: sub.path ? `/${productName}${sub.path}` : sub.path,
        })),
      })),
    [productName]
  );

  const educationalLayerItems = useMemo(
    () =>
      baseEducationalLayersItems.map((item) => ({
        ...item,
        path: item.path ? `/${productName}${item.path}` : undefined,
        subItems: item.subItems?.map((sub) => ({
          ...sub,
          path: sub.path ? `/${productName}${sub.path}` : sub.path,
        })),
      })),
    [productName]
  );

  const miscItems = useMemo(
    () =>
      baseMiscItems.map((item) => ({
        ...item,
        path: item.path ? `/${productName}${item.path}` : undefined,
        subItems: item.subItems?.map((sub) => ({
          ...sub,
          path: sub.path ? `/${productName}${sub.path}` : sub.path,
        })),
      })),
    [productName]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    const items = navItems;
    items.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {nav.comingSoon &&
                  (isExpanded || isHovered || isMobileOpen) && (
                    <span
                      className={`ml-auto ${
                        isActive(nav.path)
                          ? "menu-dropdown-badge-active"
                          : "menu-dropdown-badge-inactive"
                      } menu-dropdown-badge`}
                    >
                      COMING SOON
                    </span>
                  )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                        {subItem.comingSoon && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            COMING SOON
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
         ${
           isExpanded || isMobileOpen
             ? "w-[350px]"
             : isHovered
               ? "w-[350px]"
               : "w-[90px]"
         }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-6 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <ModeSwitcherCompact
          isExpanded={isExpanded || isHovered || isMobileOpen}
        />
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {mode === "blueprint" ? (
              <>
                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "Business Layers"
                    ) : (
                      <HorizontaLDots className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(navItems, "main")}
                </div>
                <div className="mt-6">
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "DOMAIN DRIVEN DESIGN LAYERS"
                    ) : (
                      <HorizontaLDots className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(dddLayerItems, "others")}
                </div>
                <div className="mt-6">
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "Software Layers"
                    ) : (
                      <HorizontaLDots className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(softwareLayerItems, "others")}
                </div>
                <div className="mt-6">
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "Educational Layers"
                    ) : (
                      <HorizontaLDots className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(educationalLayerItems, "others")}
                </div>
                <div className="mt-6">
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "Misc"
                    ) : (
                      <HorizontaLDots className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(miscItems, "others")}
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "Workflows"
                    ) : (
                      <HorizontaLDots className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(factoryWorkflowItems, "main")}
                </div>
                <div className="mt-6">
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "Configuration"
                    ) : (
                      <HorizontaLDots className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(factoryProviderItems, "others")}
                </div>
              </>
            )}
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
