<?php
/**
 * @file
 * Contains \Drupal\jcarousel\Plugin\Field\FieldFormatter\JCarouselFormatter.
 */

namespace Drupal\jcarousel\Plugin\Field\FieldFormatter;
use Drupal\Component\Utility\Unicode;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\image\Plugin\Field\FieldFormatter\ImageFormatter;
use Drupal\jcarousel\jCarouselSkinsManager;
use Symfony\Component\DependencyInjection\ContainerInterface;


/**
 * Plugin implementation of the 'jCarousel' formatter.
 *
 * @FieldFormatter(
 *   id = "jcarousel",
 *   label = @Translation("jCarousel"),
 *   field_types = {
 *     "image"
 *   }
 * )
 */
class JCarouselFormatter extends ImageFormatter implements ContainerFactoryPluginInterface {

  /**
   * jCarousel Skin Manager.
   *
   * @var \Drupal\jcarousel\jCarouselSkinsManager
   */
  protected $skinsManager;

  /**
   * Constructs an ImageFormatter object.
   *
   * @param string $plugin_id
   *   The plugin_id for the formatter.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Field\FieldDefinitionInterface $field_definition
   *   The definition of the field to which the formatter is associated.
   * @param array $settings
   *   The formatter settings.
   * @param string $label
   *   The formatter label display setting.
   * @param string $view_mode
   *   The view mode.
   * @param array $third_party_settings
   *   Any third party settings settings.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Drupal\Core\Entity\EntityStorageInterface $image_style_storage
   *   The image style storage.
   * @param \Drupal\jcarousel\jCarouselSkinsManager $skins_manager
   *   Jcarousel Skin manager.
   */
  public function __construct($plugin_id, $plugin_definition, FieldDefinitionInterface $field_definition, array $settings, $label, $view_mode, array $third_party_settings, AccountInterface $current_user, EntityStorageInterface $image_style_storage, jCarouselSkinsManager $skins_manager) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $label, $view_mode, $third_party_settings, $current_user, $image_style_storage);
    $this->skinsManager = $skins_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['label'],
      $configuration['view_mode'],
      $configuration['third_party_settings'],
      $container->get('current_user'),
      $container->get('entity_type.manager')->getStorage('image_style'),
      $container->get('jcarousel.skins.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'wrap' => NULL,
      'skin' => 'default',
      'visible' => NULL,
      'responsive' => 0,
      'scroll' => '',
      'auto' => 0,
      'autoPause' => '1',
      'animation' => '',
      'start' => '1',
      'easing' => NULL,
      'vertical' => FALSE,
      'navigation' => '',
      'swipe' => 1,
      'draggable' => TRUE,
      'method' => 'scroll',
      ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $element = parent::settingsForm($form, $form_state);

    // Build the list of skins as options.
    $skins = $this->skinsManager->getDefinitions();
    foreach ($skins as $key => $skin) {
      $skins[$key] = $skin['label'];
    }
    $skins[''] = $this->t('None');

    // Number of options to provide in count-based options.
    $start_range = range(-10, 10);
    $range = array_combine($start_range, $start_range);
    // Remove '0'.
    unset($range[0]);
    $auto_range = ['' => t('Auto')] + array_combine(range(1, 10), range(1, 10));

    $element['description'] = [
      '#type' => 'markup',
      '#value' => '<div class="messages">' . t('The jCarousel style is affected by several other settings within the display. Enable the "Use AJAX" option on your display to have items loaded dynamically. The "Items to display" option will determine how many items are preloaded into the carousel on each AJAX request. Non-AJAX carousels will contain the total number of items set in the "Items to display" option. Carousels may not be used with the "Use pager" option.') . '</div>',
    ];

    $element['wrap'] = [
      '#type' => 'select',
      '#title' => t('Wrap content'),
      '#default_value' => $this->getSetting('wrap'),
      '#description' => t('Specifies whether to wrap at the first/last item (or both) and jump back to the start/end.'),
      '#options' => [
        0 => t('Disabled'),
        'circular' => t('Circular'),
        'both' => t('Both'),
        'last' => t('Last'),
        'first' => t('First'),
      ],
    ];
    $element['skin'] = [
      '#type' => 'select',
      '#title' => t('Skin'),
      '#default_value' => $this->getSetting('skin'),
      '#options' => $skins,
      '#description' => t('Skins may be provided by other modules. Set to "None" if your theme includes carousel theming directly in style.css or another stylesheet. "None" does not include any built-in navigation, arrows, or positioning at all.'),
    ];
    $element['responsive'] = [
      '#type' => 'checkbox',
      '#title' => t('Responsive (number of items)'),
      '#default_value' => $this->getSetting('responsive'),
      '#description' => t('Select this option to have the carousel automatically adjust the number of visible items and the number of items to scroll at a time based on the available width.') . ' <strong>' . t('Changing this option will override the "Visible" and "Scroll" options and set carousel orientation to "horizontal".') . '</strong>',
    ];
    $element['visible'] = [
      '#type' => 'select',
      '#title' => t('Number of visible items'),
      '#options' => $auto_range,
      '#default_value' => $this->getSetting('visible'),
      '#description' => t('Set an exact number of items to show at a time. It is recommended to leave set this to "auto", in which the number of items will be determined automatically by the space available to the carousel.') . ' <strong>' . t('Changing this option will override "width" properties set in your CSS.') . '</strong>',
    ];
    $element['scroll'] = [
      '#type' => 'select',
      '#title' => t('Scroll'),
      '#description' => t('The number of items to scroll at a time. The "auto" setting scrolls all the visible items.'),
      '#options' => $auto_range,
      '#default_value' => $this->getSetting('scroll'),
    ];
    $element['auto'] = [
      '#type' => 'textfield',
      '#title' => t('Auto-scroll after'),
      '#size' => 4,
      '#maxlength' => 4,
      '#default_value' => $this->getSetting('auto'),
      '#field_suffix' => ' ' . t('seconds'),
      '#description' => t('Specifies how many seconds to periodically auto-scroll the content. If set to 0 (default) then autoscrolling is turned off.'),
    ];
    $element['navigation'] = [
      '#type' => 'select',
      '#title' => t('Enable navigation'),
      '#options' => [
        '' => t('None'),
        'before' => t('Before'),
        'after' => t('After'),
      ],
      '#default_value' => $this->getSetting('navigation'),
      '#description' => t('Enable a clickable navigation list to jump straight to a given page.'),
    ];

    $element['advanced'] = [
      '#type' => 'fieldset',
      '#title' => t('Advanced'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#parents' => ['style_options'],
    ];
    $element['advanced']['animation'] = [
      '#type' => 'textfield',
      '#title' => t('Animation speed'),
      '#size' => 10,
      '#maxlength' => 10,
      '#default_value' => $this->getSetting('animation'),
      '#description' => t('The speed of the scroll animation as string in jQuery terms ("slow"  or "fast") or milliseconds as integer (See <a href="http://api.jquery.com/animate/">jQuery Documentation</a>).'),
    ];
    $element['advanced']['easing'] = [
      '#type' => 'textfield',
      '#title' => t('Easing effect'),
      '#size' => 10,
      '#maxlength' => 128,
      '#default_value' => $this->getSetting('easing'),
      '#description' => t('The name of the easing effect that you want to use such as "swing" (the default) or "linear". See list of options in the <a href="http://api.jquery.com/animate/">jQuery Documentation</a>.'),
    ];
    $element['advanced']['start'] = [
      '#type' => 'select',
      '#title' => t('Start position'),
      '#description' => t('The item that will be shown as the first item in the list upon loading. Useful for starting a list in the middle of a set. A negative value allows choosing an item in the end, e.g. -1 is the last item.'),
      '#options' => $range,
      '#default_value' => $this->getSetting('start'),
    ];
    $element['advanced']['autoPause'] = [
      '#type' => 'checkbox',
      '#title' => t('Pause auto-scroll on hover'),
      '#description' => t('If auto-scrolling, pause the carousel when the user hovers the mouse over an item.'),
      '#default_value' => $this->getSetting('autoPause'),
    ];
    $element['advanced']['vertical'] = [
      '#type' => 'checkbox',
      '#title' => t('Vertical'),
      '#description' => t('Specifies wether the carousel appears in horizontal or vertical orientation. Changes the carousel from a left/right style to a up/down style carousel. Defaults to horizontal.'),
      '#default_value' => $this->getSetting('vertical'),
    ];

    $link_types = [
      'content' => t('Content'),
      'file' => t('File'),
    ];
    $element['image_link'] = [
      '#title' => t('Link image to'),
      '#type' => 'select',
      '#default_value' => $this->getSetting('image_link'),
      '#empty_option' => t('Nothing'),
      '#options' => $link_types,
    ];

    $element['advanced']['swipe'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable jcarouselSwipe plugin'),
      '#description' => $this->t('Adds support user-friendly swipe gestures.'),
      '#default_value' => $this->getSetting('swipe'),
    ];
    $element['advanced']['draggable'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('On/off dragging items on swipe'),
      '#default_value' => $this->getSetting('draggable'),
    ];
    $element['advanced']['method'] = [
      '#type' => 'select',
      '#title' => $this->t('Swipe method'),
      '#options' => [
        'scroll' => $this->t('Scroll'),
        'scrollIntoView' => $this->t('ScrollIntoView'),
      ],
      '#default_value' => $this->getSetting('method'),
      '#description' => $this->t('What method should used to switch slides.'),
    ];
    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = parent::settingsSummary();

    $wrap = $this->getSetting('wrap');
    if ($wrap != 0) {
      $summary[] = t('Wrap content: @wrap', ['@wrap' => Unicode::ucfirst($wrap)]);
    }

    $skin = $this->getSetting('skin');
    $skin_name = t('None');
    if (!empty($skin)) {
      $skins = $this->skinsManager->getDefinitions();
      $skin_name = isset($skins[$skin]) ? $skins[$skin]['label'] : t('Broken skin !skin', ['!skin' => $skin]);
    }
    $summary[] = t('Skin: @skin', ['@skin' => $skin_name]);

    $responsive = $this->getSetting('responsive');
    if ($responsive != 0) {
      $summary[] = t('Responsive (number of items): @responsive', ['@responsive' => $responsive]);
    }

    $visible = $this->getSetting('visible');
    $visible_name = empty($visible) ? t('Auto') : $visible;
    $summary[] = t('Number of visible items: @visible', ['@visible' => $visible_name]);

    $scroll = $this->getSetting('scroll');
    $scroll_name = empty($visible) ? t('All visible') : $scroll;
    $summary[] = t('Number of items to scroll at a time: @scroll', ['@scroll' => $scroll_name]);

    $auto = $this->getSetting('auto');
    if (!empty($auto)) {
      $summary[] = t('Auto-scroll after @auto seconds', ['@auto' => $auto]);
      $auto_pause = $this->getSetting('autoPause');
      $auto_pause_name = $auto_pause == TRUE ? t('Yes') : t('No');
      $summary[] = t('Pause auto-scroll on hover: @auto_pause', ['@auto_pause' => $auto_pause_name]);
    }

    $navigation = $this->getSetting('navigation');
    $navigation_name = empty($navigation) ? t('Disabled') : Unicode::ucfirst($navigation);
    $summary[] = t('Navigation: @navigation', ['@navigation' => $navigation_name]);

    $animation = $this->getSetting('animation');
    if (!empty($animation)) {
      if (is_int($animation)) {
        $summary[] = t('Navigation: @animation seconds', ['@animation' => $animation]);
      }
      else {
        $summary[] = t('Navigation: @animation', ['@animation' => $animation]);
      }
    }

    $easing = $this->getSetting('easing');
    if (!empty($easing)) {
      $summary[] = t('Easing effect: @easing', ['@easing' => $easing]);
    }

    $start = $this->getSetting('start');
    $summary[] = t('Start position: @start', ['@start' => $start]);

    $vertical = $this->getSetting('vertical');
    if ($vertical == TRUE) {
      $summary[] = t('Vertical: Yes');
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $jcarousel_items = parent::viewElements($items, $langcode);

    $jcarousel_options = $this->getSettings();
    unset($jcarousel_items['image_link']);
    unset($jcarousel_items['image_style']);

    $elements[] = [
      '#theme' => 'jcarousel',
      '#items' => $jcarousel_items,
      '#options' => $jcarousel_options,
    ];

    return $elements;
  }

}
