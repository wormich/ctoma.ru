<?php

namespace Drupal\view_swipe_format\Plugin\views\style;

use Drupal\views\Plugin\views\style;

/**
 * Style plugin to render each item in an ordered or unordered list.
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "swipe",
 *   title = @Translation("Swipe"),
 *   help = @Translation("Displays rows as Swipe format."),
 *   theme = "views_view_swipe",
 *   display_types = {"normal"}
 * )
 */
class swipe extends style\StylePluginBase {

  /**
   * Does the style plugin allows to use style plugins.
   *
   * @var bool
   */
  protected $usesRowPlugin = TRUE;

  /**
   * Does the style plugin support custom css class for the rows.
   *
   * @var bool
   */
  protected $usesRowClass = TRUE;
}
